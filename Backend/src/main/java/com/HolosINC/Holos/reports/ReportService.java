package com.HolosINC.Holos.reports;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.exceptions.InvalidReportTypeException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.work.Work;
import org.springframework.web.server.ResponseStatusException;

import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUserService;
import com.HolosINC.Holos.work.WorkService;

@Service
public class ReportService {
    
    private final ReportRepository reportRepository;
    private final ReportTypeRepository reportTypeRepository;
    private final WorkService worskService;
    private final BaseUserService baseUserService;

    private ArtistService artistService;

    @Autowired
    public ReportService(ReportRepository reportRepository, ReportTypeRepository reportTypeRepository, WorkService worskService, BaseUserService baseUserService) {
        this.reportRepository = reportRepository;
        this.reportTypeRepository = reportTypeRepository;
        this.worskService = worskService;
        this.baseUserService = baseUserService;
    }

    public List<ReportType> getReportTypes() {
        return reportTypeRepository.findAll();
    }

    public List<Report> getReports() {
        return reportRepository.findAll();
    }

    public Report createReport(ReportDTO reportDTO) {
        Work work = worskService.getWorkById(reportDTO.getWorkId());
        ReportType reportType = reportTypeRepository
            .findByType(reportDTO.getReportType())
            .orElseThrow(() -> new RuntimeException("Invalid report type"));
        BaseUser baseUser = baseUserService.findCurrentUser();

        boolean alreadyReported = reportRepository.existsByMadeByIdAndWorkIdAndReportTypeId(baseUser.getId(), work.getId(), reportType.getId());

        if (alreadyReported) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "¡Ya has reportado esta obra!");
        }

        Report report = reportDTO.createReport(work, reportType);

        report.setStatus(ReportStatus.PENDING);
        report.setMadeBy(baseUser);
        report.setReportedUser(work.getArtist().getBaseUser());
        report.setWork(work);
    
        return reportRepository.save(report);
    }

    public Report reportWorkAndArtist(String reportName, String description, BaseUser reporter, Artist artist, Work work, String typeName) {
        try {
            if (typeName == null || typeName.trim().isEmpty()) {
                throw new InvalidReportTypeException("Debes seleccionar un tipo de reporte existente.");
            }

            ReportType reportType = reportTypeRepository.findByType(typeName)
                    .orElseThrow(() -> new InvalidReportTypeException("El tipo de reporte '" + typeName + "' no existe."));

            Report report = Report.builder()
                    .name(reportName)
                    .description(description)
                    .madeBy(reporter)
                    .reportedUser(artist)
                    .work(work)
                    .status(ReportStatus.PENDING)
                    .reportType(reportType)
                    .build();

            return reportRepository.save(report);
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar el reporte: " + e.getMessage(), e);
        }
    }
    
    @Transactional
    public Report acceptReport(Long reportId) {
        try {
            Report report = getReportByIdOrThrow(reportId);
    
            if (report.getStatus() != ReportStatus.PENDING) {
                throw new IllegalStateException("Solo se pueden aceptar reportes en estado PENDING.");
            }
    
            report.setStatus(ReportStatus.ACCEPTED);
    
            Artist artist = report.getReportedUser();
            if (artist != null) {
                System.out.println("Baneando artista con ID: " + artist.getId());
    
                artist.setBanned(true);
                artist.setBannedUntil(LocalDateTime.now().plusDays(7));
                artistService.saveArtist(artist);
            }
    
            return reportRepository.save(report);
    
        } catch (Exception e) {
            e.printStackTrace(); 
            throw new RuntimeException("Fallo interno al aceptar el reporte");
        }
    }
    
    
    public Report rejectReport(Long reportId) {
        Report report = getReportByIdOrThrow(reportId);
    
        if (report.getStatus() != ReportStatus.PENDING) {
            throw new IllegalStateException("Solo se pueden rechazar reportes en estado PENDING.");
        }
    
        report.setStatus(ReportStatus.REJECTED);
        return reportRepository.save(report);
    }
    
    public void deleteReport(Long reportId) {
        Report report = getReportByIdOrThrow(reportId);
    
        if (report.getStatus() != ReportStatus.REJECTED) {
            throw new IllegalStateException("Solo se pueden eliminar reportes que hayan sido rechazados.");
        }
    
        reportRepository.delete(report);
    }
    
    private Report getReportByIdOrThrow(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reporte no encontrado con ID: " + id));
    }

    public boolean hasPendingReportsForType(ReportType reportType) {
        List<Report> reports = reportRepository.findAll();
    
        return reports.stream()
            .anyMatch(report ->
                report.getReportType() != null &&
                report.getReportType().getId().equals(reportType.getId()) &&
                report.getStatus() == ReportStatus.PENDING
            );
    } 
    
    @Transactional
    public void unlinkReportTypeFromReports(ReportType reportType) {
        List<Report> relatedReports = reportRepository.findAll().stream()
            .filter(r -> r.getReportType() != null && r.getReportType().getId().equals(reportType.getId()))
            .toList();

        for (Report report : relatedReports) {
            report.setReportType(null);
            reportRepository.save(report);
        }
    }


}

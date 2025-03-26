package com.HolosINC.Holos.reports;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.exceptions.InvalidReportTypeException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.work.Work;
import org.springframework.web.server.ResponseStatusException;

import com.HolosINC.Holos.model.BaseUserService;
import com.HolosINC.Holos.work.WorkService;

@Service
public class ReportService {
    
    private final ReportRepository reportRepository;
    private final ReportTypeRepository reportTypeRepository;
    private final WorkService workService;
    private final BaseUserService baseUserService;

    @Autowired
    public ReportService(ReportRepository reportRepository, ReportTypeRepository reportTypeRepository, WorkService workService, BaseUserService baseUserService) {
        this.reportRepository = reportRepository;
        this.reportTypeRepository = reportTypeRepository;
        this.workService = workService;
        this.baseUserService = baseUserService;
    }

    public List<ReportType> getReportTypes() {
        return reportTypeRepository.findAll();
    }

    public List<Report> getReports() {
        return reportRepository.findAll();
    }

    @Transactional
    public Report createReportDTO(ReportDTO reportDTO) {
        Work work = workService.getBaseWorkById(reportDTO.getWorkId());
        
        List<ReportType> matches = reportTypeRepository.findAllByType(reportDTO.getReportType());
        if (matches.isEmpty()) {
            throw new RuntimeException("Tipo de reporte inválido.");
        } else if (matches.size() > 1) {
            throw new RuntimeException("Error: se han encontrado múltiples tipos de reporte con el mismo nombre. Contacta con soporte.");
        }
        ReportType reportType = matches.get(0);
    
        BaseUser baseUser = baseUserService.findCurrentUser();
    
        boolean alreadyReported = reportRepository.existsByMadeByIdAndWorkIdAndReportTypeId(
            baseUser.getId(), work.getId(), reportType.getId());
    
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
    
    @Transactional
public Report createReport(String name, String description, Long workId, Long reportTypeId) {
    try {
        BaseUser currentUser = baseUserService.findCurrentUser();

        Work work = workService.getBaseWorkById(workId);
        if (work == null) {
            throw new IllegalArgumentException("El trabajo especificado no existe.");
        }

        ReportType reportType = reportTypeRepository.findById(reportTypeId)
            .orElseThrow(() -> new IllegalArgumentException("Tipo de reporte no encontrado."));

        boolean exists = reportRepository.existsByMadeByIdAndWorkIdAndReportTypeId(
            currentUser.getId(), workId, reportTypeId);

        if (exists) {
            throw new IllegalStateException("Ya has enviado un reporte de este tipo para este trabajo.");
        }

        Report report = Report.builder()
            .name(name)
            .description(description)
            .status(ReportStatus.PENDING)
            .madeBy(currentUser)
            .reportedUser(work.getArtist().getBaseUser())
            .work(work)
            .reportType(reportType)
            .build();

        return reportRepository.save(report);

    } catch (ResponseStatusException e) {
        throw e;
    } catch (Exception e) {
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno al crear el reporte.");
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
    
            BaseUser bannedUser = report.getReportedUser();
            if (bannedUser != null) {
    
                bannedUser.setIsBanned(true);
                bannedUser.setUnbanDate(LocalDateTime.now().plusDays(7));
                baseUserService.save(bannedUser);
            }
    
            return reportRepository.save(report);
    
        } catch (Exception e) {
            e.printStackTrace(); 
            throw new RuntimeException("Fallo interno al aceptar el reporte");
        }
    }

    @Transactional
    public Report rejectReport(Long reportId) {
        Report report = reportRepository.findById(reportId)
            .orElseThrow(() -> new IllegalArgumentException("Reporte no encontrado con ID: " + reportId));

        if (report.getStatus() != ReportStatus.PENDING) {
            throw new IllegalStateException("Solo se pueden rechazar reportes en estado PENDING.");
        }

        report.setStatus(ReportStatus.REJECTED);

        return reportRepository.save(report);
    }

    
    
    public Report deleteReport(Long reportId) {
        Report report = getReportByIdOrThrow(reportId);
    
        if (report.getStatus() != ReportStatus.REJECTED) {
            throw new IllegalStateException("Solo se pueden eliminar reportes que hayan sido rechazados.");
        }
    
        reportRepository.delete(report);
        return report;
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

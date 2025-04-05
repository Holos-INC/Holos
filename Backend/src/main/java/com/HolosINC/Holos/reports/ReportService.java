package com.HolosINC.Holos.reports;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;
import com.HolosINC.Holos.work.Work;
import com.HolosINC.Holos.work.WorkService;

import jakarta.transaction.Transactional;

@Service
public class ReportService {
    
    private final ReportRepository reportRepository;
    private final ReportTypeRepository reportTypeRepository;
    private final WorkService worskService;
    private final BaseUserService baseUserService;

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

    public ReportType addReportType(ReportType reportType) {
        if (reportTypeRepository.findByType(reportType.getType()).isPresent()) {
            throw new IllegalArgumentException("Report type name already exists");
        }
        return reportTypeRepository.save(reportType);
    }

    @Transactional
    public Report acceptReport(Long reportId) {
            Report report = getReportByIdOrThrow(reportId);
    
            if (report.getStatus() != ReportStatus.PENDING) {
                throw new IllegalStateException("Solo se pueden aceptar reportes en estado PENDING.");
            }
    
            report.setStatus(ReportStatus.ACCEPTED);
    
            return reportRepository.save(report);  
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

    public ReportType getReportTypeByType(String type) {
        return reportTypeRepository.findByType(type)
                .orElseThrow(() -> new ResourceNotFoundException("Report type not found"));
    }
}

package com.HolosINC.Holos.reports;

import java.util.List;

import org.springframework.stereotype.Service;

import com.HolosINC.Holos.exceptions.AccessDeniedException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;
import com.HolosINC.Holos.work.Work;
import com.HolosINC.Holos.work.WorkService;
import com.HolosINC.Holos.worksdone.WorksDoneService;

import jakarta.transaction.Transactional;

@Service
public class ReportService {
    
    private final ReportRepository reportRepository;
    private final ReportTypeRepository reportTypeRepository;
    private final WorkService worskService;
    private final WorksDoneService wdService;

    private final BaseUserService baseUserService;

    public ReportService(WorksDoneService wdService, ReportRepository reportRepository, ReportTypeRepository reportTypeRepository, WorkService worskService, BaseUserService baseUserService) {
        this.wdService = wdService;
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

    public Report createReport(ReportDTO reportDTO) throws Exception{
        Work work = worskService.getWorkById(reportDTO.getWorkId());
        ReportType reportType = reportTypeRepository
            .findByType(reportDTO.getReportType())
            .orElseThrow(() -> new AccessDeniedException("Invalid report type"));
        BaseUser baseUser = baseUserService.findCurrentUser();

        boolean alreadyReported = reportRepository.existsByMadeByIdAndWorkIdAndReportTypeId(baseUser.getId(), work.getId(), reportType.getId());

        if (alreadyReported) {
            throw new AccessDeniedException("¡Ya has reportado esta obra!");
        }

        Report report = reportDTO.createReport(work, reportType);

        report.setStatus(ReportStatus.PENDING);
        report.setMadeBy(baseUser);
        report.setReportedUser(work.getArtist().getBaseUser());
        report.setWork(work);
    
        return reportRepository.save(report);
    }

    public ReportType addReportType(ReportType reportType) throws Exception{
        if (reportTypeRepository.findByType(reportType.getType()).isPresent()) {
            throw new IllegalArgumentException("Report type name already exists");
        }
        return reportTypeRepository.save(reportType);
    }

    @Transactional
    public Report acceptReport(Long reportId) throws Exception{
            Report report = getReportByIdOrThrow(reportId);
    
            if (report.getStatus() != ReportStatus.PENDING) {
                throw new IllegalStateException("Solo se pueden aceptar reportes en estado PENDING.");
            }
    
            report.setStatus(ReportStatus.ACCEPTED);
            wdService.deleteWorksDone(report.getWork().getId());
            
            return reportRepository.save(report);  
    }

    public void deleteReport(Long reportId) throws Exception{
        Report report = getReportByIdOrThrow(reportId);
        if (report.getStatus() == ReportStatus.ACCEPTED) {
            throw new IllegalStateException("No se puede eliminar un reporte aceptado.");
        }
        reportRepository.delete(report);
    }
    
    private Report getReportByIdOrThrow(Long id) throws Exception{
        return reportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reporte no encontrado con ID: " + id));
    }

    public ReportType getReportTypeByType(String type) throws Exception{
        return reportTypeRepository.findByType(type)
                .orElseThrow(() -> new ResourceNotFoundException("Report type not found"));
    }
}

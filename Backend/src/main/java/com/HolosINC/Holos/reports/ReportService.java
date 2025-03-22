package com.HolosINC.Holos.reports;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;
import com.HolosINC.Holos.work.Work;
import com.HolosINC.Holos.work.WorkService;

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

        Report report = reportDTO.createReport(work, reportType);
        BaseUser baseUser = baseUserService.findCurrentUser();

        report.setStatus(ReportStatus.PENDING);
        report.setMadeBy(baseUser);
        report.setReportedUser(work.getArtist());
        report.setWork(work);
    
        return reportRepository.save(report);
    }

    public ReportType addReportType(ReportType reportType) {
        if (reportTypeRepository.findByType(reportType.getType()).isPresent()) {
            throw new IllegalArgumentException("Report type name already exists");
        }
        return reportTypeRepository.save(reportType);
    }

    public Report deleteReport(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid report id"));
        reportRepository.delete(report);
        return report;
    }
    
    public Report acceptReport(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        if (report.getStatus() == ReportStatus.ACCEPTED) {
            throw new IllegalArgumentException("Report already accepted");
        }
        report.setStatus(ReportStatus.ACCEPTED);
        return reportRepository.save(report);
    }

    public Report rejectReport(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        if (report.getStatus() == ReportStatus.REJECTED) {
            throw new IllegalArgumentException("Report already rejected");
        }
        report.setStatus(ReportStatus.REJECTED);
        return reportRepository.save(report);
    }

    public ReportType getReportTypeByType(String type) {
        return reportTypeRepository.findByType(type)
                .orElseThrow(() -> new ResourceNotFoundException("Report type not found"));
    }
}

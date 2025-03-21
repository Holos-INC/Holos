package com.HolosINC.Holos.reports;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HolosINC.Holos.exceptions.ResourceNotFoundException;

@Service
public class ReportService {
    
    private ReportRepository reportRepository;

    private ReportTypeRepository reportTypeRepository;

    @Autowired
    public ReportService(ReportRepository reportRepository, ReportTypeRepository reportTypeRepository) {
        this.reportRepository = reportRepository;
        this.reportTypeRepository = reportTypeRepository;
    }

    public List<ReportType> getReportTypes() {
        return reportTypeRepository.findAll();
    }

    public List<Report> getReports() {
        return reportRepository.findAll();
    }

    public Report addReport(Report report) {
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

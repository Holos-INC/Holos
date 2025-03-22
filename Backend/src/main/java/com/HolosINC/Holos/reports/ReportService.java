package com.HolosINC.Holos.reports;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.work.Work;
import com.HolosINC.Holos.work.WorkRepository;

@Service
public class ReportService {
    
    private ReportRepository reportRepository;

    private WorkRepository workRepository;

    private ReportTypeRepository reportTypeRepository;

    @Autowired
    public ReportService(ReportRepository reportRepository, ReportTypeRepository reportTypeRepository, WorkRepository workRepository) {
        this.reportRepository = reportRepository;
        this.reportTypeRepository = reportTypeRepository;
        this.workRepository = workRepository;
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
        try {
            Report report = reportRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

            if (report.getStatus() != ReportStatus.PENDING) {
                throw new IllegalArgumentException("Solo se pueden aceptar reportes en estado PENDING");
            }

            Work work = report.getWork();
            if (work != null) {
                workRepository.delete(work);
            }

            report.setStatus(ReportStatus.ACCEPTED);
            return reportRepository.save(report);

        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error al aceptar el reporte con ID " + id + ": " + e.getMessage());
        }
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

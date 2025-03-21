package com.HolosINC.Holos.reports;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.model.BaseUserService;
import com.HolosINC.Holos.work.WorkService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/reports")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Report Controller", description = "API for managing Reports")
public class ReportController {
    private ReportService reportService;
    private WorkService workService;
    private BaseUserService baseUserService;

    public ReportController(ReportService reportService, WorkService workService, BaseUserService baseUserService) {
        this.reportService = reportService;
        this.workService = workService;
        this.baseUserService = baseUserService;
    }

    // Para el administrador
    @PostMapping("/admin")
    public ResponseEntity<?> getAllReports() {
        try {
            List<Report> reports = reportService.getReports();
            return ResponseEntity.ok(reports);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> addReport(@RequestBody ReportDTO reportDTO) {
        try {
            Report newReport = Report.builder()
                    .name(reportDTO.getName())
                    .description(reportDTO.getDescription())
                    .status(ReportStatus.PENDING)
                    .madeBy(baseUserService.findCurrentUser())
                    .reportedUser(workService.getWorkById(reportDTO.getWorkId()).getArtist())
                    .work(workService.getWorkById(reportDTO.getWorkId()))
                    .reportType(reportService.getReportTypeByType(reportDTO.getReportType()))
                    .build();
            Report report = reportService.addReport(newReport);
            return ResponseEntity.ok(report);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteReport(@PathVariable Long id) {
        try {
            Report deletedReport = reportService.deleteReport(id);
            return ResponseEntity.ok(deletedReport);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PutMapping("/admin/accept/{id}")
    public ResponseEntity<?> acceptReport(@PathVariable Long id) {
        try {
            Report acceptedReport = reportService.acceptReport(id);
            return ResponseEntity.ok(acceptedReport);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PutMapping("/admin/reject/{id}")
    public ResponseEntity<?> rejectReport(@PathVariable Long id) {
        try {
            Report rejectedReport = reportService.rejectReport(id);
            return ResponseEntity.ok(rejectedReport);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/types")
    public ResponseEntity<?> getReportTypes() {
        try {
            List<ReportType> reportTypes = reportService.getReportTypes();
            return ResponseEntity.ok(reportTypes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/admin/types")
    public ResponseEntity<?> addReportType(@RequestBody ReportType reportType) {
        try {
            ReportType newReportType = reportService.addReportType(reportType);
            return ResponseEntity.ok(newReportType);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}

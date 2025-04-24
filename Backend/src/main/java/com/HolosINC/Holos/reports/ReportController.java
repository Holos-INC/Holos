package com.HolosINC.Holos.reports;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/reports")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Report Controller", description = "API for managing Reports")
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // Para el administrador
    @GetMapping("/admin")
    @Operation(summary = "Get all reports", description = "Retrieve all reports for the administrator.")
    @ApiResponse(responseCode = "200", description = "Reports retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Bad Request")
    public ResponseEntity<?> getAllReports() {
        try {
            List<Report> reports = reportService.getReports();
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    @Operation(summary = "Create a new report", description = "Creates a new report based on the provided data.")
    @ApiResponse(responseCode = "200", description = "Report created successfully")
    @ApiResponse(responseCode = "400", description = "Bad Request")
    public ResponseEntity<?> createReport(@Valid @RequestBody ReportDTO reportDTO) {
        try {
            Report report = reportService.createReport(reportDTO);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/admin/accept/{id}")
    @Operation(summary = "Accept a report", description = "Mark a report as accepted by the administrator.")
    @ApiResponse(responseCode = "200", description = "Report accepted successfully")
    @ApiResponse(responseCode = "400", description = "Bad Request")
    public ResponseEntity<?> acceptReport(@PathVariable Long id) {
        try {
            Report accepted = reportService.acceptReport(id);
            return ResponseEntity.ok(accepted);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/admin/reject/{id}")
    @Operation(summary = "Reject a report", description = "Mark a report as rejected by the administrator.")
    @ApiResponse(responseCode = "200", description = "Report rejected successfully")
    @ApiResponse(responseCode = "400", description = "Bad Request")
    public ResponseEntity<?> rejectReport(@PathVariable Long id) {
        try {
            Report rejected = reportService.rejectReport(id);
            return ResponseEntity.ok(rejected);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/admin/delete/{id}")
    @Operation(summary = "Delete a rejected report", description = "Delete a report that has been rejected by the administrator.")
    @ApiResponse(responseCode = "200", description = "Report deleted successfully")
    @ApiResponse(responseCode = "400", description = "Bad Request")
    public ResponseEntity<?> deleteRejectedReport(@PathVariable Long id) {
        try {
            reportService.deleteReport(id);
            return ResponseEntity.ok("Report deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/types")
    @Operation(summary = "Get all report types", description = "Retrieve all report types available.")
    @ApiResponse(responseCode = "200", description = "Report types retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Bad Request")
    public ResponseEntity<?> getReportTypes() {
        try {
            List<ReportType> reportTypes = reportService.getReportTypes();
            return ResponseEntity.ok(reportTypes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/admin/types")
    @Operation(summary = "Add a new report type", description = "Adds a new type of report to the system.")
    @ApiResponse(responseCode = "200", description = "Report type added successfully")
    @ApiResponse(responseCode = "400", description = "Bad Request")
    public ResponseEntity<?> addReportType(@RequestBody ReportType reportType) {
        try {
            ReportType newReportType = reportService.addReportType(reportType);
            return ResponseEntity.ok(newReportType);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

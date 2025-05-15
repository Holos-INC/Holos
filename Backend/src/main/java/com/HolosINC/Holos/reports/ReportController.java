package com.HolosINC.Holos.reports;

import java.util.List;

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
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/reports")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Report Controller", description = "API for managing Reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @Operation(
        summary = "Get all reports for admin",
        description = "Retrieve all reports in the system (admin only)",
        responses = {
            @ApiResponse(responseCode = "200", description = "Reports retrieved successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Report.class))),
            @ApiResponse(responseCode = "400", description = "Error retrieving reports", content = @Content(mediaType = "application/json"))
        }
    )
    @GetMapping("/admin")
    public ResponseEntity<?> getAllReports() {
        try {
            List<Report> reports = reportService.getReports();
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(
        summary = "Create a new report",
        description = "Create a new report from the provided data",
        responses = {
            @ApiResponse(responseCode = "200", description = "Report created successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Report.class))),
            @ApiResponse(responseCode = "400", description = "Error creating report", content = @Content(mediaType = "application/json"))
        }
    )
    @PostMapping
    public ResponseEntity<?> createReport(@Valid @RequestBody ReportDTO reportDTO) {
        try {
            Report report = reportService.createReport(reportDTO);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(
        summary = "Accept a report",
        description = "Admin accepts a report by its ID",
        responses = {
            @ApiResponse(responseCode = "200", description = "Report accepted successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Report.class))),
            @ApiResponse(responseCode = "400", description = "Error accepting report", content = @Content(mediaType = "application/json"))
        }
    )
    @PutMapping("/admin/accept/{id}")
    public ResponseEntity<?> acceptReport(@PathVariable Long id) {
        try {
            Report accepted = reportService.acceptReport(id);
            return ResponseEntity.ok(accepted);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(
        summary = "Delete a rejected report",
        description = "Admin deletes a rejected report by its ID",
        responses = {
            @ApiResponse(responseCode = "200", description = "Report deleted successfully"),
            @ApiResponse(responseCode = "400", description = "Error deleting report", content = @Content(mediaType = "application/json"))
        }
    )
    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<?> deleteRejectedReport(@PathVariable Long id) {
        try {
            reportService.deleteReport(id);
            return ResponseEntity.ok("Reporte eliminado correctamente.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(
        summary = "Get all report types",
        description = "Retrieve all report types",
        responses = {
            @ApiResponse(responseCode = "200", description = "Report types retrieved successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ReportType.class))),
            @ApiResponse(responseCode = "400", description = "Error retrieving report types", content = @Content(mediaType = "application/json"))
        }
    )
    @GetMapping("/types")
    public ResponseEntity<?> getReportTypes() {
        try {
            List<ReportType> reportTypes = reportService.getReportTypes();
            return ResponseEntity.ok(reportTypes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(
        summary = "Add a new report type",
        description = "Add a new report type to the system",
        responses = {
            @ApiResponse(responseCode = "200", description = "Report type added successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ReportType.class))),
            @ApiResponse(responseCode = "400", description = "Error adding report type", content = @Content(mediaType = "application/json"))
        }
    )
    @PostMapping("/admin/types")
    public ResponseEntity<?> addReportType(@RequestBody ReportType reportType) {
        try {
            ReportType newReportType = reportService.addReportType(reportType);
            return ResponseEntity.ok(newReportType);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

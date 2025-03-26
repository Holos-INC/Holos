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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.HolosINC.Holos.exceptions.InvalidReportTypeException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;
import com.HolosINC.Holos.work.Work;
import com.HolosINC.Holos.work.WorkService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/reports")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Report Controller", description = "API for managing Reports")
public class ReportController {

    private final ReportService reportService;
    private final BaseUserService baseUserService;
    private final WorkService workService;

    @Autowired
    public ReportController(ReportService reportService, BaseUserService baseUserService, WorkService workService) {
        this.reportService = reportService;
        this.baseUserService = baseUserService;
        this.workService = workService;
    }

    @GetMapping("/admin/allReports")
    public ResponseEntity<?> getAllReports() {
        try {
            List<Report> reports = reportService.getReports();
            return ResponseEntity.ok(reports);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createReportDTO(@Valid @RequestBody ReportDTO reportDTO) {
        try {
            Report report = reportService.createReportDTO(reportDTO);
            return ResponseEntity.ok(report);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Ha ocurrido un error inesperado.");
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createReport(
        @RequestParam String name,
        @RequestParam String description,
        @RequestParam Long workId,
        @RequestParam Long reportTypeId
    ) {
        try {
            Report report = reportService.createReport(name, description, workId, reportTypeId);
            return ResponseEntity.status(201).body(report);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno al crear el reporte.");
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
            Report accepted = reportService.acceptReport(id);
            return ResponseEntity.ok(accepted);
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno al aceptar el reporte");
        }
    }

    @PutMapping("/admin/reject/{id}")
    public ResponseEntity<?> rejectReport(@PathVariable Long id) {
        try {
            Report rejected = reportService.rejectReport(id);
            return ResponseEntity.ok(rejected);
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno al rechazar el reporte");
        }
    }


    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<?> deleteRejectedReport(@PathVariable Long id) {
        try {
            reportService.deleteReport(id);
            return ResponseEntity.ok("Reporte eliminado correctamente.");
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno al eliminar el reporte");
        }
    }
    
}

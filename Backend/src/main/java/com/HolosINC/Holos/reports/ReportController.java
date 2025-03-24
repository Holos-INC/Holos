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

import com.HolosINC.Holos.artist.ArtistService;
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

    @PostMapping("/report")
    public ResponseEntity<?> reportWorkAndArtist(
            @RequestParam String reportName,
            @RequestParam String description,
            @RequestParam Long workId,
            @RequestParam(required = false) String type) {
        try {
            if (workId == null) {
                return ResponseEntity.badRequest().body("El ID del trabajo no puede ser nulo.");
            }

            BaseUser reporter = baseUserService.findCurrentUser();
            Work work = workService.getWorkById(workId);
            if (work == null) {
                return ResponseEntity.badRequest().body("Trabajo no encontrado con ID: " + workId);
            }

            Report report = reportService.reportWorkAndArtist(
                    reportName, description, reporter, work.getArtist(), work, type
            );

            return ResponseEntity.status(201).body(report);

        } catch (InvalidReportTypeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al procesar el reporte: " + e.getMessage());
        }
    }

    @GetMapping("/admin/allReports")
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
    public ResponseEntity<?> createReport(@Valid @RequestBody ReportDTO reportDTO) {
        try {
            Report report = reportService.createReport(reportDTO);
            return ResponseEntity.ok(report);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Ha ocurrido un error inesperado.");
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
            Report accepted = reportService.rejectReport(id);
            return ResponseEntity.ok(accepted);
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

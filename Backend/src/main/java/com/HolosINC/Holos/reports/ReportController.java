package com.HolosINC.Holos.reports;

import java.util.List;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;
import com.HolosINC.Holos.work.Work;
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
    @GetMapping("/admin")
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

@PostMapping("/{id}")
public ResponseEntity<?> addReport(@PathVariable Long id, @RequestBody ReportDTO reportDTO) {
    try {
        Work work = workService.getWorkById(id);
        if (work == null) {
            return ResponseEntity.badRequest().body("La obra con ID " + id + " no existe.");
        }

        // Verificar si el usuario está autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Usuario no autenticado.");
        }

        // Obtener el usuario autenticado
        BaseUser user = baseUserService.findCurrentUser();

        // Obtener el tipo de reporte
        ReportType reportType = reportService.getReportTypeByType(reportDTO.getReportType());

        // Crear el reporte
        Report newReport = Report.builder()
                .name(reportDTO.getName())
                .description(reportDTO.getDescription())
                .status(ReportStatus.PENDING)
                .madeBy(user)
                .reportedUser(work.getArtist())
                .work(work)
                .reportType(reportType)
                .build();

        Report report = reportService.addReport(newReport);
        return ResponseEntity.ok(report);

    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body("Error: " + e.getMessage());
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.internalServerError().body("Error interno al crear el reporte");
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
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno al aceptar el reporte");
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

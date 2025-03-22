package com.HolosINC.Holos.reports;

import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.HolosINC.Holos.exceptions.InvalidReportTypeException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/report-types")
@Tag(name = "Report Type Controller", description = "API for managing Reports Types")
public class ReportTypeController {

    @Autowired
    private ReportTypeService reportTypeService;

    @Autowired
    private BaseUserService baseUserService;

    @PostMapping("/admin/create")
    public ResponseEntity<?> createReportType(@RequestParam String typeName) {
        try {
            BaseUser currentUser = baseUserService.findCurrentUser();
            if (!currentUser.hasAuthority("ADMIN")) {
                return ResponseEntity.status(403).body("Solo los administradores pueden crear tipos de reporte.");
            }

            ReportType created = reportTypeService.createReportType(typeName);
            return ResponseEntity.status(201).body(created);

        } catch (InvalidReportTypeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al crear el tipo de reporte: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ReportType>> getAllReportTypes() {
        try {
            return ResponseEntity.ok(reportTypeService.getAllReportTypes());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<?> updateReportType(@PathVariable Long id, @RequestParam String newTypeName) {
        try {
            BaseUser currentUser = baseUserService.findCurrentUser();
            if (!currentUser.hasAuthority("ADMIN")) {
                return ResponseEntity.status(403).body("Solo los administradores pueden crear tipos de reporte.");
            }

            ReportType updated = reportTypeService.updateReportType(id, newTypeName);
            return ResponseEntity.ok(updated);
        } catch (InvalidReportTypeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al actualizar: " + e.getMessage());
        }
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteReportType(@PathVariable Long id) {
        try {
            BaseUser currentUser = baseUserService.findCurrentUser();
            if (!currentUser.hasAuthority("ADMIN")) {
                return ResponseEntity.status(403).body("Solo los administradores pueden crear tipos de reporte.");
            }
            
            reportTypeService.deleteReportType(id);
            return ResponseEntity.ok("Tipo de reporte eliminado con éxito.");
        } catch (InvalidReportTypeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al eliminar: " + e.getMessage());
        }
    }
}

package com.HolosINC.Holos.commision;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.HolosINC.Holos.commision.DTOs.CommisionRequestDTO;
import com.HolosINC.Holos.commision.DTOs.CommissionDTO;
import com.HolosINC.Holos.commision.DTOs.HistoryCommisionsDTO;
import com.HolosINC.Holos.exceptions.AccessDeniedException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/commisions")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Commision Controller", description = "API for managing Commisions")
public class CommisionController {

    private final CommisionService commisionService;

    @Autowired
    public CommisionController(CommisionService commisionService) {
        this.commisionService = commisionService;
    }

    @PostMapping("/{artistId}")
    public ResponseEntity<?> createCommision(@Valid @RequestBody CommisionRequestDTO commision, @PathVariable Long artistId) {
        try {
            CommissionDTO createdCommision = commisionService.createCommision(commision, artistId);
            return ResponseEntity.ok(createdCommision);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{commisionId}/requestChanges")
    public ResponseEntity<?> changeRequestedCommision(@Valid @RequestBody CommissionDTO commision, @PathVariable Long commisionId) {
        try {
            commisionService.requestChangesCommision(commision, commisionId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/historyOfCommisions/mine")
    public ResponseEntity<HistoryCommisionsDTO> getClientCommissions() throws Exception {
        try {
            HistoryCommisionsDTO commissions = commisionService.getHistoryOfCommissions();
            return ResponseEntity.ok(commissions);
        } catch (Exception e) {
            HistoryCommisionsDTO withError = new HistoryCommisionsDTO();
            withError.setError(e.getMessage());
            return ResponseEntity.badRequest().body(withError);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCommisionById(@PathVariable Long id) {
        try {
            // Llamamos al servicio para obtener la comisión por ID
            CommissionDTO commision = commisionService.getCommisionById(id);
            
            // Devolvemos la comisión si existe
            return ResponseEntity.ok(commision);
        } catch (ResourceNotFoundException e) {
            // Si la comisión no se encuentra, respondemos con un 404
            return ResponseEntity.notFound().build();
        } catch (AccessDeniedException e) {
            // Si el usuario no tiene acceso a la comisión, respondemos con un 403
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Si ocurre un error inesperado, respondemos con un 500
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PutMapping("/{commissionId}/waiting")
    public ResponseEntity<?> waitingCommission(@Valid @RequestBody CommissionDTO commission,
            @PathVariable Long commissionId) {
        try {
            commisionService.waitingCommission(commission, commissionId);
            return ResponseEntity.ok("En espera de confirmación del precio.");
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("⚠ Error interno: " + e.getMessage());
        }
    }

    @PutMapping("/{commissionId}/toPay")
    public ResponseEntity<?> toPayCommission(
            @PathVariable Long commissionId) {
        try {
            commisionService.toPayCommission(commissionId);
            return ResponseEntity.ok("Se aceptó el precio correctamente.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("⚠ Error interno: " + e.getMessage());
        }
    }

    @PutMapping("/{commissionId}/reject")
    public ResponseEntity<?> rejectCommission(
            @PathVariable Long commissionId) {
        try {
            commisionService.rejectCommission(commissionId);
            return ResponseEntity.ok("Comisión rechazada correctamente.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("⚠ Error interno: " + e.getMessage());
        }
    }

    @PutMapping("/{commissionId}/accept")
    public ResponseEntity<?> acceptCommission(
            @PathVariable Long commissionId) {
        try {
            commisionService.acceptCommission(commissionId);
            return ResponseEntity.ok("Comisión pagada correctamente.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("⚠ Error interno: " + e.getMessage());
        }
    }

    @PutMapping("/{commissionId}/cancel")
    public ResponseEntity<?> cancelCommision(
            @PathVariable Long commissionId) {
        try {
            commisionService.cancelCommission(commissionId);
            return ResponseEntity.ok("Comisión cancelada correctamente.");
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("⚠ Error interno: " + e.getMessage());
        }
    }

}

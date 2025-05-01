package com.HolosINC.Holos.commision;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HolosINC.Holos.commision.DTOs.ClientCommissionDTO;
import com.HolosINC.Holos.commision.DTOs.CommisionRequestDTO;
import com.HolosINC.Holos.commision.DTOs.CommissionDTO;
import com.HolosINC.Holos.commision.DTOs.CommissionImageUpdateDTO;
import com.HolosINC.Holos.commision.DTOs.HistoryCommisionsDTO;
import com.HolosINC.Holos.exceptions.AccessDeniedException;
import com.HolosINC.Holos.exceptions.BadRequestException;
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

    @GetMapping("/ordered/{username}")
    public ResponseEntity<?> getClientCommissionsDone(@PathVariable String username) throws Exception {
        try {
            List<CommissionDTO> commissions = commisionService.getCommissionsDone(username);
            return ResponseEntity.ok(commissions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
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

    @GetMapping("/{id}/done")
    public ResponseEntity<?> getCommisionDoneById(@PathVariable Long id) {
        try {
            // Llamamos al servicio para obtener la comisión por ID
            CommissionDTO commision = commisionService.getCommisionDoneById(id);
            
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

    @PutMapping("/{commissionId}/close")
    public ResponseEntity<?> closeCommission(@PathVariable Long commissionId) {
        try {
            commisionService.closeCommission(commissionId);
            return ResponseEntity.ok("Comisión cerrada correctamente.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("⚠ Error interno: " + e.getMessage());
        }
    }    
  
    @PutMapping("/{commisionId}/updateImage")
    public ResponseEntity<?> updateCommisionImage(
            @PathVariable Long commisionId,
            @RequestBody CommissionImageUpdateDTO dto) {
        try {
            commisionService.updateImage(commisionId, dto.getImage());
            return ResponseEntity.ok().body("Imagen actualizada correctamente.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar la imagen: " + e.getMessage());
        }
    }

    @GetMapping("/ended/client")
    public ResponseEntity<?> getEndedCommissionsForClient() {
        try {
            List<ClientCommissionDTO> commissions = commisionService.getEndedCommissionsForClient();
            return ResponseEntity.ok(commissions);
        } catch (IllegalAccessException e) {
            return ResponseEntity.status(403).body("Acceso denegado: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al obtener las comisiones finalizadas: " + e.getMessage());
        }
    }

    @GetMapping("/payment-arrangements")
    public List<String> getPaymentArrangements() {
        // Devuelve los valores del enum como una lista de cadenas
        return Arrays.stream(EnumPaymentArrangement.values())
                     .map(EnumPaymentArrangement::name)  // .name() convierte el valor en una cadena
                     .collect(Collectors.toList());
    }

    @PutMapping("/{id}/decline-payment")
    public ResponseEntity<?> declinePayment(@PathVariable Long id) {
        try {
            commisionService.declinePayment(id);
            return ResponseEntity.ok("Pago rechazado correctamente.");
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).body("Acceso denegado: " + e.getMessage());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body("Recurso no encontrado: " + e.getMessage());
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest().body("Solicitud inválida: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al rechazar el pago: " + e.getMessage());
        }
    }    
}

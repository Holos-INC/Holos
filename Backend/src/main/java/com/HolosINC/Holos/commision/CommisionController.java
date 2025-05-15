package com.HolosINC.Holos.commision;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.HolosINC.Holos.commision.DTOs.ClientCommissionDTO;
import com.HolosINC.Holos.commision.DTOs.CommisionRequestDTO;
import com.HolosINC.Holos.commision.DTOs.CommissionDTO;
import com.HolosINC.Holos.commision.DTOs.CommissionImageUpdateDTO;
import com.HolosINC.Holos.commision.DTOs.HistoryCommisionsDTO;
import com.HolosINC.Holos.exceptions.AccessDeniedException;
import com.HolosINC.Holos.exceptions.BadRequestException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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

    @Operation(summary = "Create a new commission for an artist",
               description = "Creates a new commission associated with the specified artist ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Commission created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request or error")
    })
    @PostMapping("/{artistId}")
    public ResponseEntity<?> createCommision(@Valid @RequestBody CommisionRequestDTO commision, @PathVariable Long artistId) {
        try {
            CommissionDTO createdCommision = commisionService.createCommision(commision, artistId);
            return ResponseEntity.ok(createdCommision);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Request changes on a commission",
               description = "Submits change requests for the commission with the given ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Change request processed successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request or error")
    })
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

    @Operation(summary = "Get history of commissions for current client",
               description = "Retrieves the history of commissions related to the authenticated client.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "History retrieved successfully"),
        @ApiResponse(responseCode = "400", description = "Error retrieving history")
    })
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

    @Operation(summary = "Get commissions done by a client",
               description = "Returns the list of commissions marked as done for a client by username.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Commissions retrieved successfully"),
        @ApiResponse(responseCode = "400", description = "Error retrieving commissions")
    })
    @GetMapping("/ordered/{username}")
    public ResponseEntity<?> getClientCommissionsDone(@PathVariable String username) throws Exception {
        try {
            List<CommissionDTO> commissions = commisionService.getCommissionsDone(username);
            return ResponseEntity.ok(commissions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Get commission by ID",
               description = "Fetches commission details by commission ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Commission retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied"),
        @ApiResponse(responseCode = "404", description = "Commission not found"),
        @ApiResponse(responseCode = "400", description = "Error occurred")
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> getCommisionById(@PathVariable Long id) {
        try {
            CommissionDTO commision = commisionService.getCommisionById(id);
            return ResponseEntity.ok(commision);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Get done commission by ID",
               description = "Fetches details of a commission that is done by ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Done commission retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied"),
        @ApiResponse(responseCode = "404", description = "Commission not found"),
        @ApiResponse(responseCode = "400", description = "Error occurred")
    })
    @GetMapping("/{id}/done")
    public ResponseEntity<?> getCommisionDoneById(@PathVariable Long id) {
        try {
            CommissionDTO commision = commisionService.getCommisionDoneById(id);
            return ResponseEntity.ok(commision);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Set commission to waiting state",
               description = "Updates a commission to waiting state, usually after price confirmation is pending.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Commission set to waiting successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid state or error")
    })
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

    @Operation(summary = "Set commission to toPay state",
               description = "Marks the commission as ready to be paid.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Commission set to toPay successfully"),
        @ApiResponse(responseCode = "400", description = "Error processing request")
    })
    @PutMapping("/{commissionId}/toPay")
    public ResponseEntity<?> toPayCommission(@PathVariable Long commissionId) {
        try {
            commisionService.toPayCommission(commissionId);
            return ResponseEntity.ok("Se aceptó el precio correctamente.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("⚠ Error interno: " + e.getMessage());
        }
    }

    @Operation(summary = "Reject a commission",
               description = "Rejects the commission with the given ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Commission rejected successfully"),
        @ApiResponse(responseCode = "400", description = "Error processing request")
    })
    @PutMapping("/{commissionId}/reject")
    public ResponseEntity<?> rejectCommission(@PathVariable Long commissionId) {
        try {
            commisionService.rejectCommission(commissionId);
            return ResponseEntity.ok("Comisión rechazada correctamente.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("⚠ Error interno: " + e.getMessage());
        }
    }

    @Operation(summary = "Accept a commission",
               description = "Marks the commission as paid and accepted.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Commission accepted successfully"),
        @ApiResponse(responseCode = "400", description = "Error processing request")
    })
    @PutMapping("/{commissionId}/accept")
    public ResponseEntity<?> acceptCommission(@PathVariable Long commissionId) {
        try {
            commisionService.acceptCommission(commissionId);
            return ResponseEntity.ok("Comisión pagada correctamente.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("⚠ Error interno: " + e.getMessage());
        }
    }

    @Operation(summary = "Cancel a commission",
               description = "Cancels the commission with the given ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Commission canceled successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid state or error")
    })
    @PutMapping("/{commissionId}/cancel")
    public ResponseEntity<?> cancelCommision(@PathVariable Long commissionId) {
        try {
            commisionService.cancelCommission(commissionId);
            return ResponseEntity.ok("Comisión cancelada correctamente.");
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("⚠ Error interno: " + e.getMessage());
        }
    }

    @Operation(summary = "Close a commission",
               description = "Closes the commission with the given ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Commission closed successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid state or error")
    })
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

    @Operation(summary = "Update commission image",
               description = "Updates the image associated with a commission.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Image updated successfully"),
        @ApiResponse(responseCode = "400", description = "Error updating image")
    })
    @PutMapping("/{commisionId}/updateImage")
    public ResponseEntity<?> updateCommisionImage(@PathVariable Long commisionId,
                                                  @RequestBody CommissionImageUpdateDTO dto) {
        try {
            commisionService.updateImage(commisionId, dto.getImage());
            return ResponseEntity.ok().body("Imagen actualizada correctamente.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar la imagen: " + e.getMessage());
        }
    }

    @Operation(summary = "Get ended commissions for the current client",
               description = "Returns the commissions that have been finalized for the authenticated client.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Ended commissions retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied"),
        @ApiResponse(responseCode = "400", description = "Error retrieving commissions")
    })
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

    @Operation(summary = "Get payment arrangement types",
               description = "Returns a list of possible payment arrangements.")
    @ApiResponse(responseCode = "200", description = "List of payment arrangements")
    @GetMapping("/payment-arrangements")
    public List<String> getPaymentArrangements() {
        return Arrays.stream(EnumPaymentArrangement.values())
                .map(EnumPaymentArrangement::name)
                .collect(Collectors.toList());
    }

    @Operation(summary = "Decline a payment",
               description = "Declines the payment for the commission with the given ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payment declined successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied"),
        @ApiResponse(responseCode = "404", description = "Resource not found"),
        @ApiResponse(responseCode = "400", description = "Bad request or invalid input")
    })
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

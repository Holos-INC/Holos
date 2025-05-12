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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/v1/commisions")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Commision Controller", description = "API for managing Commisions")
public class CommisionController {

    private final CommisionService commisionService;

    public CommisionController(CommisionService commisionService) {
        this.commisionService = commisionService;
    }

    @Operation(
        summary = "Create a new commission",
        description = "Creates a new commission for an artist.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Commission created successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CommissionDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input or error creating commission", content = @Content(mediaType = "application/json"))
        }
    )
    @PostMapping("/{artistId}")
    public ResponseEntity<?> createCommision(
            @Valid @RequestBody @Parameter(description = "Commission details to create") CommisionRequestDTO commision, 
            @PathVariable Long artistId) {
        try {
            CommissionDTO createdCommision = commisionService.createCommision(commision, artistId);
            return ResponseEntity.ok(createdCommision);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(
        summary = "Request changes to a commission",
        description = "Request changes for an existing commission.",
        responses = {
            @ApiResponse(responseCode = "204", description = "Changes requested successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or error requesting changes", content = @Content(mediaType = "application/json"))
        }
    )
    @PutMapping("/{commisionId}/requestChanges")
    public ResponseEntity<?> changeRequestedCommision(
            @Valid @RequestBody @Parameter(description = "Updated commission details") CommissionDTO commision, 
            @PathVariable Long commisionId) {
        try {
            commisionService.requestChangesCommision(commision, commisionId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(
        summary = "Get history of commissions",
        description = "Retrieve the history of commissions for the logged-in client.",
        responses = {
            @ApiResponse(responseCode = "200", description = "History of commissions fetched successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = HistoryCommisionsDTO.class))),
            @ApiResponse(responseCode = "400", description = "Error fetching commission history", content = @Content(mediaType = "application/json"))
        }
    )
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

    @Operation(
        summary = "Get commissions done by client",
        description = "Retrieve all commissions completed by a specific client.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Commissions fetched successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CommissionDTO.class))),
            @ApiResponse(responseCode = "400", description = "Error fetching commissions", content = @Content(mediaType = "application/json"))
        }
    )
    @GetMapping("/ordered/{username}")
    public ResponseEntity<?> getClientCommissionsDone(@PathVariable String username) throws Exception {
        try {
            List<CommissionDTO> commissions = commisionService.getCommissionsDone(username);
            return ResponseEntity.ok(commissions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(
        summary = "Get commission by ID",
        description = "Retrieve the details of a commission by its ID.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Commission details fetched successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CommissionDTO.class))),
            @ApiResponse(responseCode = "404", description = "Commission not found", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "400", description = "Access denied or error fetching commission", content = @Content(mediaType = "application/json"))
        }
    )
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

    @Operation(
        summary = "Update commission image",
        description = "Update the image associated with a commission.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Commission image updated successfully"),
            @ApiResponse(responseCode = "400", description = "Error updating commission image", content = @Content(mediaType = "application/json"))
        }
    )
    @PutMapping("/{commisionId}/updateImage")
    public ResponseEntity<?> updateCommisionImage(
            @PathVariable Long commisionId,
            @RequestBody @Parameter(description = "New image details") CommissionImageUpdateDTO dto) {
        try {
            commisionService.updateImage(commisionId, dto.getImage());
            return ResponseEntity.ok().body("Imagen actualizada correctamente.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar la imagen: " + e.getMessage());
        }
    }

    @Operation(
        summary = "Get all ended commissions for client",
        description = "Fetch all ended commissions for a specific client.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Ended commissions fetched successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ClientCommissionDTO.class))),
            @ApiResponse(responseCode = "400", description = "Error fetching ended commissions", content = @Content(mediaType = "application/json"))
        }
    )
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

    @Operation(
        summary = "Get payment arrangement types",
        description = "Retrieve the available payment arrangements types for commissions.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Payment arrangements fetched successfully", content = @Content(mediaType = "application/json"))
        }
    )
    @GetMapping("/payment-arrangements")
    public List<String> getPaymentArrangements() {
        return Arrays.stream(EnumPaymentArrangement.values())
                     .map(EnumPaymentArrangement::name)
                     .collect(Collectors.toList());
    }

    @Operation(
        summary = "Decline payment for commission",
        description = "Decline a payment for a commission by its ID.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Payment declined successfully"),
            @ApiResponse(responseCode = "400", description = "Error declining payment", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "403", description = "Access denied", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "404", description = "Resource not found", content = @Content(mediaType = "application/json"))
        }
    )
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

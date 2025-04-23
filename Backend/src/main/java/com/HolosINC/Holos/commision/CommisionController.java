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
import io.swagger.v3.oas.annotations.Operation;
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
    @Operation(summary = "Create a new commission for a specific artist",
               description = "Creates a new commission for an artist identified by their ID.")
    public ResponseEntity<?> createCommision(@Valid @RequestBody CommisionRequestDTO commision, @PathVariable Long artistId) {
        try {
            CommissionDTO createdCommision = commisionService.createCommision(commision, artistId);
            return ResponseEntity.ok(createdCommision);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{commisionId}/requestChanges")
    @Operation(summary = "Request changes to an existing commission",
               description = "Allows requesting changes to an existing commission by providing updated data.")
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
    @Operation(summary = "Get history of client's commissions",
               description = "Retrieves the history of commissions for the logged-in client.")
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
    @Operation(summary = "Get a commission by its ID",
               description = "Retrieves a specific commission using its ID.")
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

    @PutMapping("/{commissionId}/waiting")
    @Operation(summary = "Set commission status to 'waiting'",
               description = "Sets the commission status to 'waiting' for confirmation of price.")
    public ResponseEntity<?> waitingCommission(@Valid @RequestBody CommissionDTO commission,
            @PathVariable Long commissionId) {
        try {
            commisionService.waitingCommission(commission, commissionId);
            return ResponseEntity.ok("Waiting for price confirmation.");
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("⚠ Internal error: " + e.getMessage());
        }
    }

    @PutMapping("/{commissionId}/toPay")
    @Operation(summary = "Set commission status to 'to pay'",
               description = "Changes the commission status to 'to pay' after confirming the price.")
    public ResponseEntity<?> toPayCommission(
            @PathVariable Long commissionId) {
        try {
            commisionService.toPayCommission(commissionId);
            return ResponseEntity.ok("Price confirmed successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("⚠ Internal error: " + e.getMessage());
        }
    }

    @PutMapping("/{commissionId}/reject")
    @Operation(summary = "Reject a commission",
               description = "Rejects a commission by changing its status.")
    public ResponseEntity<?> rejectCommission(
            @PathVariable Long commissionId) {
        try {
            commisionService.rejectCommission(commissionId);
            return ResponseEntity.ok("Commission rejected successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("⚠ Internal error: " + e.getMessage());
        }
    }

    @PutMapping("/{commissionId}/accept")
    @Operation(summary = "Accept a commission",
               description = "Accepts a commission by changing its status to accepted.")
    public ResponseEntity<?> acceptCommission(
            @PathVariable Long commissionId) {
        try {
            commisionService.acceptCommission(commissionId);
            return ResponseEntity.ok("Commission accepted successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("⚠ Internal error: " + e.getMessage());
        }
    }

    @PutMapping("/{commissionId}/cancel")
    @Operation(summary = "Cancel a commission",
               description = "Cancels a commission and processes refund if applicable.")
    public ResponseEntity<?> cancelCommision(
            @PathVariable Long commissionId) {
        try {
            commisionService.cancelCommission(commissionId);
            return ResponseEntity.ok("Commission canceled successfully.");
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("⚠ Internal error: " + e.getMessage());
        }
    }

}

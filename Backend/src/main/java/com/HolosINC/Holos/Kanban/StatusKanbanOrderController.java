package com.HolosINC.Holos.Kanban;

import java.util.List;

import javax.validation.Valid;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.HolosINC.Holos.Kanban.DTOs.StatusKanbanCreateDTO;
import com.HolosINC.Holos.Kanban.DTOs.StatusKanbanDTO;
import com.HolosINC.Holos.Kanban.DTOs.StatusKanbanFullResponseDTO;
import com.HolosINC.Holos.Kanban.DTOs.StatusKanbanUpdateDTO;
import com.HolosINC.Holos.exceptions.BadRequestException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.exceptions.ResourceNotOwnedException;
import com.HolosINC.Holos.model.BaseUserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/status-kanban-order")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Status Kanban", description = "API for controlling the usage of the Kanban")
public class StatusKanbanOrderController {

    private final StatusKanbanOrderService statusKanbanOrderService;
    private final BaseUserService baseUserService;

    public StatusKanbanOrderController(StatusKanbanOrderService statusKanbanOrderService, BaseUserService baseUserService) {
        this.statusKanbanOrderService = statusKanbanOrderService;
        this.baseUserService = baseUserService;
    }

    @Operation(
        summary = "Create a new Kanban status for the authenticated artist",
        description = "Creates a new Kanban status, including name, color, and description.",
        responses = {
            @ApiResponse(responseCode = "201", description = "Kanban status created successfully"),
            @ApiResponse(responseCode = "400", description = "Error creating Kanban status", content = @Content(mediaType = "application/json"))
        }
    )
    @PostMapping
    public ResponseEntity<?> addStatusToKanban(@Valid @RequestBody StatusKanbanCreateDTO dto) {
        try {
            statusKanbanOrderService.addStatusToKanban(dto);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body("Ya existe un estado con ese nombre para este artista.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("No se pudo crear el estado Kanban: " + e.getMessage());
        }
    }

    @Operation(
        summary = "Update Kanban status attributes (name, color, and description)",
        description = "Updates the attributes of a Kanban status.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Kanban status updated successfully"),
            @ApiResponse(responseCode = "400", description = "Error updating Kanban status", content = @Content(mediaType = "application/json"))
        }
    )
    @PutMapping("/update")
    public ResponseEntity<?> updateStatusKanban(@RequestBody StatusKanbanUpdateDTO dto) {
        try {
            statusKanbanOrderService.updateStatusKanban(dto);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            throw new BadRequestException("Error inesperado al actualizar el estado Kanban: " + e.getMessage());
        }
    }

    @Operation(
        summary = "Delete a Kanban status if it is not assigned to any commission",
        description = "Deletes a Kanban status if no commissions are associated with it.",
        responses = {
            @ApiResponse(responseCode = "204", description = "Kanban status deleted successfully"),
            @ApiResponse(responseCode = "400", description = "Error deleting Kanban status", content = @Content(mediaType = "application/json"))
        }
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStatusKanbanOrder(@PathVariable Long id) {
        try {
            statusKanbanOrderService.deleteStatusKanbanOrder(id);
            return ResponseEntity.noContent().build();
        } catch (BadRequestException | ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("No se pudo eliminar el estado Kanban: " + e.getMessage());
        }
    }

    @Operation(
        summary = "Get all Kanban statuses of the authenticated artist along with associated commissions",
        description = "Fetches all Kanban statuses for the authenticated artist and their associated commissions.",
        responses = {
            @ApiResponse(responseCode = "200", description = "All Kanban statuses fetched successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = StatusKanbanFullResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Error fetching Kanban statuses", content = @Content(mediaType = "application/json"))
        }
    )
    @GetMapping
    public ResponseEntity<StatusKanbanFullResponseDTO> getAllStatusKanban() {
        try {
            StatusKanbanFullResponseDTO response = statusKanbanOrderService.getAllStatusFromArtist();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(
        summary = "Move a commission to the next Kanban status",
        description = "Advances a commission to the next Kanban status.",
        responses = {
            @ApiResponse(responseCode = "204", description = "Commission advanced to the next status successfully"),
            @ApiResponse(responseCode = "400", description = "Error advancing commission", content = @Content(mediaType = "application/json"))
        }
    )
    @PutMapping("/{id}/next")
    public ResponseEntity<Void> advanceCommisionToNextStatus(@PathVariable Long id) {
        try {
            statusKanbanOrderService.nextStatusOfCommision(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }
    }

    @Operation(
        summary = "Move a commission to the previous Kanban status",
        description = "Moves a commission back to the previous Kanban status.",
        responses = {
            @ApiResponse(responseCode = "204", description = "Commission moved to the previous status successfully"),
            @ApiResponse(responseCode = "400", description = "Error moving commission", content = @Content(mediaType = "application/json"))
        }
    )
    @PutMapping("/{id}/previous")
    public ResponseEntity<Void> moveCommisionToPreviousStatus(@PathVariable Long id) {
        try {
            statusKanbanOrderService.previousStatusOfCommision(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }
    }

    @Operation(
        summary = "Get Kanban status by ID",
        description = "Fetches a specific Kanban status by its ID.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Kanban status fetched successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = StatusKanbanDTO.class))),
            @ApiResponse(responseCode = "404", description = "Kanban status not found", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "400", description = "Error fetching Kanban status", content = @Content(mediaType = "application/json"))
        }
    )
    @GetMapping("/{id}")
    public ResponseEntity<StatusKanbanDTO> getStatusKanban(@PathVariable Long id) {
        StatusKanbanDTO dto = statusKanbanOrderService.getStatusKanbanById(id);
        return ResponseEntity.ok(dto);
    }

    @Operation(
        summary = "Get the number of payments required for a moderator by artist username",
        description = "Fetches the number of payments that need to be made by a moderator for an artist based on their username.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Number of payments fetched successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Integer.class))),
            @ApiResponse(responseCode = "400", description = "Error fetching number of payments", content = @Content(mediaType = "application/json"))
        }
    )
    @GetMapping("/count/{artistUsername}")
    public ResponseEntity<Integer> getNumberOfPaymentsByArtistUsername(@PathVariable String artistUsername) throws Exception {
        try {
            Integer numberOfStatusKanban = statusKanbanOrderService.countByArtistUsername(artistUsername);
            return ResponseEntity.ok(numberOfStatusKanban - 1);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Operation(
        summary = "Reorder all Kanban statuses for the artist",
        description = "Updates the order of all Kanban statuses for the authenticated artist.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Kanban statuses reordered successfully"),
            @ApiResponse(responseCode = "400", description = "Error reordering Kanban statuses", content = @Content(mediaType = "application/json"))
        }
    )
    @PutMapping("/reorder")
    public ResponseEntity<?> reorderStatuses(@RequestBody List<Long> orderedIds) {
        try {
            statusKanbanOrderService.reorderStatuses(orderedIds);
            return ResponseEntity.ok().build();
        } catch (BadRequestException | ResourceNotOwnedException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("No se pudo reordenar el Kanban: " + e.getMessage());
        }
    }
}

package com.HolosINC.Holos.Kanban;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/status-kanban-order")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Status Kanban", description = "API for controlling the usage of the kanban")
public class StatusKanbanOrderController {

    private final StatusKanbanOrderService statusKanbanOrderService;

    @Autowired
	public StatusKanbanOrderController(StatusKanbanOrderService statusKanbanOrderService) {
		this.statusKanbanOrderService = statusKanbanOrderService;
	}

    @PostMapping
    @Operation(summary = "Crea un nuevo estado Kanban para el artista autenticado")
    public ResponseEntity<?> addStatusToKanban(@Valid @RequestBody StatusKanbanCreateDTO dto) {
        try {
            statusKanbanOrderService.addStatusToKanban(dto);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity
                    .badRequest()
                    .body("Ya existe un estado con ese nombre para este artista.");
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body("No se pudo crear el estado Kanban: " + e.getMessage());
        }
    }

    @PutMapping("/update")
    @Operation(summary = "Actualiza los atributos de un estado Kanban (nombre, color y descripción)")
    public ResponseEntity<?> updateStatusKanban(@RequestBody StatusKanbanUpdateDTO dto) {
        try {
            statusKanbanOrderService.updateStatusKanban(dto);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            throw new BadRequestException("Error inesperado al actualizar el estado Kanban: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Elimina un estado Kanban si no está asignado a ninguna comisión")
    public ResponseEntity<?> deleteStatusKanbanOrder(@PathVariable Integer id) {
        try {
            statusKanbanOrderService.deleteStatusKanbanOrder(id);
            return ResponseEntity.noContent().build();
        } catch (BadRequestException | ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("No se pudo eliminar el estado Kanban: " + e.getMessage());
        }
    }    

    @GetMapping
    @Operation(summary = "Obtiene todos los estados Kanban del artista junto con sus comisiones asociadas")
    public ResponseEntity<StatusKanbanFullResponseDTO> getAllStatusKanban() {
        try {
            StatusKanbanFullResponseDTO response = statusKanbanOrderService.getAllStatusFromArtist();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/next")
    @Operation(summary = "Avanza una comisión al siguiente estado Kanban")
    public ResponseEntity<Void> advanceCommisionToNextStatus(@PathVariable Long id) {
        try{
            statusKanbanOrderService.nextStatusOfCommision(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }
    }

    @PutMapping("/{id}/previous")
    @Operation(summary = "Retrocede la comisión al estado anterior Kanban")
    public ResponseEntity<Void> moveCommisionToPreviousStatus(@PathVariable Long id) {
        try{
            statusKanbanOrderService.previousStatusOfCommision(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtiene un estado Kanban por su ID")
    public ResponseEntity<StatusKanbanDTO> getStatusKanban(@PathVariable Integer id) {
        StatusKanbanDTO dto = statusKanbanOrderService.getStatusKanbanById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/count/{artistUsername}")
    @Operation(summary = "Obtiene el número de statusKanban a partir del username del artista")
    public ResponseEntity<Integer> getStatusKanbanByArtistId(@PathVariable String artistUsername) throws Exception {
        try {
            Integer numberOfStatusKanban = statusKanbanOrderService.countByArtistUsername(artistUsername);
            return ResponseEntity.ok(numberOfStatusKanban);

        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @PutMapping("/reorder")
    @Operation(summary = "Actualiza el orden de todos los estados Kanban del artista")
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

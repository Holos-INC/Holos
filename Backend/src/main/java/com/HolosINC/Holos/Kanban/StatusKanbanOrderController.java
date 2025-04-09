package com.HolosINC.Holos.Kanban;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.HolosINC.Holos.Kanban.DTOs.StatusKanbanDTO;
import com.HolosINC.Holos.Kanban.DTOs.StatusKanbanFullResponseDTO;
import com.HolosINC.Holos.Kanban.DTOs.StatusKanbanUpdateDTO;
import com.HolosINC.Holos.Kanban.DTOs.StatusKanbanWithCommisionsDTO;
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
    public ResponseEntity<StatusKanbanOrder> addStatusToKanban(@RequestParam String color, @RequestParam String description, 
    @RequestParam String nombre, @RequestParam Integer artistId) throws Exception{
        StatusKanbanOrder sk = statusKanbanOrderService.addStatusToKanban(color, description, nombre, artistId);
        return new ResponseEntity<>(sk, HttpStatus.OK);
    }

    @PutMapping("/update")
    public StatusKanbanOrder updateStatusKanbanOrder(@RequestBody StatusKanbanOrder statusKanbanOrder) {
        return statusKanbanOrderService.updateStatusKanbanOrder(statusKanbanOrder);
    }

    //Cambiar color o descripción ¿Añadir nombre?

    @PutMapping("/{id}/updateKanban")
    public ResponseEntity<StatusKanbanOrder> updateKanban(@RequestBody StatusKanbanOrder sk) throws Exception{
        Integer id = sk.getId().intValue();
        String color = sk.getColor();
        String nombre = sk.getName();
        String description = sk.getDescription();

        StatusKanbanOrder sk2 = statusKanbanOrderService.updateKanban(id, color, description, nombre);
        return new ResponseEntity<>(sk2, HttpStatus.OK);
    }

    @PutMapping("/{id}/updateKanbanOrder")
    public ResponseEntity<StatusKanbanOrder> updateOrder(@PathVariable Long id, @RequestBody Integer order) throws Exception{
        StatusKanbanOrder sk2 = statusKanbanOrderService.updateOrder(id, order);
        return new ResponseEntity<>(sk2, HttpStatus.OK);
    }

    @PutMapping("/update")
    @Operation(summary = "Actualiza los atributos de un estado Kanban (nombre, color y descripción)")
    public ResponseEntity<?> updateStatusKanban(@Valid @RequestBody StatusKanbanUpdateDTO dto) {
        try {
            statusKanbanOrderService.updateStatusKanban(dto);
            return ResponseEntity.ok().build();
        } catch (BadRequestException | ResourceNotFoundException e) {
            throw e;
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
        Pair<List<StatusKanbanDTO>, List<StatusKanbanWithCommisionsDTO>> data =
                statusKanbanOrderService.getAllStatusFromArtist();

        StatusKanbanFullResponseDTO response = new StatusKanbanFullResponseDTO(
                data.getFirst(),
                data.getSecond()
        );

        return ResponseEntity.ok(response);
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

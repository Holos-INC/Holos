package com.HolosINC.Holos.Kanban;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/status-kanban-order")
@Tag(name = "Status Kanban", description = "API for controlling the usage of the kanban")
public class StatusKanbanOrderController {

    @Autowired
    private StatusKanbanOrderService statusKanbanOrderService;


    //No he puesto orden porque para añadir una posición concreta es mucho lío, quizá mejor que se añada siempre el último y luego se pueda mover

    @PostMapping
    public ResponseEntity<StatusKanbanOrder> addStatusToKanban(@RequestParam String color, @RequestParam String description, 
    @RequestParam String nombre, @RequestParam Long artistId) {
        StatusKanbanOrder sk = statusKanbanOrderService.addStatusToKanban(color, description, nombre, artistId);
        return new ResponseEntity<>(sk, HttpStatus.OK);
    }

    @PutMapping("/update")
    public StatusKanbanOrder updateStatusKanbanOrder(@RequestBody StatusKanbanOrder statusKanbanOrder) {
        return statusKanbanOrderService.updateStatusKanbanOrder(statusKanbanOrder);
    }

    //Cambiar color o descripción ¿Añadir nombre?

    @PutMapping("/{id}/updateKanban")
    public ResponseEntity<StatusKanbanOrder> updateKanban(@RequestBody StatusKanbanOrder sk) {
        Integer id = sk.getId().intValue();
        String color = sk.getColor();
        String nombre = sk.getName();
        String description = sk.getDescription();

        StatusKanbanOrder sk2 = statusKanbanOrderService.updateKanban(id, color, description, nombre);
        return new ResponseEntity<>(sk2, HttpStatus.OK);
    }

    @PutMapping("/{id}/updateKanbanOrder")
    public ResponseEntity<StatusKanbanOrder> updateOrder(@RequestBody StatusKanbanOrder sk) {
        Integer id = sk.getId().intValue();
        Integer order = sk.getOrder();
        StatusKanbanOrder sk2 = statusKanbanOrderService.updateOrder(id, order);
        return new ResponseEntity<>(sk2, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public void deleteStatusKanbanOrder(@PathVariable Integer id) {
        statusKanbanOrderService.deleteStatusKanbanOrder(id);
    }

    @GetMapping("/artist/{artistId}")
    public List<StatusKanbanOrder> getStatusKanbanOrderByArtist(@PathVariable Long artistId) {
        return statusKanbanOrderService.findAllStatusKanbanOrderByArtist(artistId);
    }

    @GetMapping
    public List<StatusKanbanOrder> getAllStatusKanbanOrder() {
        return statusKanbanOrderService.findAllStatusKanbanOrder();
    }

    @GetMapping("/{id}")
    public StatusKanbanOrder getStatusKanbanOrder(@PathVariable Integer id) {
        return statusKanbanOrderService.findStatusKanbanOrder(id);
    }
}

package com.HolosINC.Holos.Kanban;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/status-kanban-order")
public class StatusKanbanOrderController {

    @Autowired
    private StatusKanbanOrderService statusKanbanOrderService;

    @PostMapping
    public StatusKanbanOrder createStatusKanbanOrder(@RequestBody StatusKanbanOrder statusKanbanOrder) {
        return statusKanbanOrderService.createStatusKanbanOrder(statusKanbanOrder);
    }

    @PutMapping("/update")
    public StatusKanbanOrder updateStatusKanbanOrder(@RequestBody StatusKanbanOrder statusKanbanOrder) {
        return statusKanbanOrderService.updateStatusKanbanOrder(statusKanbanOrder);
    }

    @DeleteMapping("/{id}")
    public void deleteStatusKanbanOrder(@PathVariable Integer id) {
        statusKanbanOrderService.deleteStatusKanbanOrder(id);
    }

    @GetMapping("/artist/{artistId}")
    public List<StatusKanbanOrder> getStatusKanbanOrderByArtist(@PathVariable Integer artistId) {
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

package com.HolosINC.Holos.Kanban.DTOs;

import com.HolosINC.Holos.Kanban.StatusKanbanOrder;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StatusKanbanDTO {

    private Long id;
    
    private String name;

    private Integer order;

    private String description;

    private String color;

    public StatusKanbanOrder createStatusKanbanOrder() {
        StatusKanbanOrder statusKanban = new StatusKanbanOrder();
        statusKanban.setName(this.getName());
        statusKanban.setOrder(this.getOrder());
        statusKanban.setDescription(this.getDescription());
        statusKanban.setColor(this.getColor());
        return statusKanban;
    }
}

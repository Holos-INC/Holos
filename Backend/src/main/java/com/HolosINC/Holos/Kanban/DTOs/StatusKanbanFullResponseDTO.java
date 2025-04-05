package com.HolosINC.Holos.Kanban.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class StatusKanbanFullResponseDTO {
    private List<StatusKanbanDTO> statuses;
    private List<StatusKanbanWithCommisionsDTO> commissions;
}

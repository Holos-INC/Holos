package com.HolosINC.Holos.Kanban.DTOs;

import java.util.List;

import com.HolosINC.Holos.Kanban.StatusKanbanOrder;
import com.HolosINC.Holos.commision.EnumPaymentArrangement;
import com.HolosINC.Holos.commision.DTOs.CommisionDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StatusKanbanWithCommisionsDTO {

    private Long id;
    
    private String name;
    
    private String description;
    
    private Double price;
    
    private Integer numMilestones;
    
    private EnumPaymentArrangement paymentArrangement;

    private String statusKanbanName;

    private String clientUsername;
}

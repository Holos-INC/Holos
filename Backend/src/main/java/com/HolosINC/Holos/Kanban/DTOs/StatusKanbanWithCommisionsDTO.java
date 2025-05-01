package com.HolosINC.Holos.Kanban.DTOs;

import com.HolosINC.Holos.commision.EnumPaymentArrangement;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StatusKanbanWithCommisionsDTO {

    private Long id;
    
    private String name;
    
    private String description;
    
    private Double price;
    
    // private Integer numMilestones;
    
    private EnumPaymentArrangement paymentArrangement;

    private String statusKanbanName;

    private String clientUsername;

    private Boolean isWaitingPayment;
}

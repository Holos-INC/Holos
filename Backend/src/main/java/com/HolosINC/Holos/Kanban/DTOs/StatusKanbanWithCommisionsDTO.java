package com.HolosINC.Holos.Kanban.DTOs;

import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.EnumPaymentArrangement;
import com.HolosINC.Holos.commision.UpdateStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StatusKanbanWithCommisionsDTO {

    private Long id;
    
    private String name;
    
    private String description;
    
    private Double price;
    
    private EnumPaymentArrangement paymentArrangement;

    private String statusKanbanName;

    private String clientUsername;

    private Boolean isWaitingPayment;

    private byte[] image;

    private byte[] oldImage;

    private byte[] newImage;

    private UpdateStatus lastUpdateStatus;

    public StatusKanbanWithCommisionsDTO(Commision c) {
        this.id = c.getId();
        this.name = c.getName();
        this.description = c.getDescription();
        this.price = c.getPrice();
        this.paymentArrangement = c.getPaymentArrangement();
        this.statusKanbanName = c.getStatusKanbanOrder().getName();
        this.clientUsername = c.getClient().getBaseUser().getUsername();
        this.image = c.getImage() != null ? c.getImage() : new byte[0];
        this.isWaitingPayment = c.isWaitingPayment();
        this.newImage = c.getArtistNewImage() != null ? c.getArtistNewImage() : new byte[0];
        this.oldImage = c.getArtistOldImage() != null ? c.getArtistOldImage() : new byte[0];
        this.lastUpdateStatus = c.getLastUpdateStatus();
    }
}

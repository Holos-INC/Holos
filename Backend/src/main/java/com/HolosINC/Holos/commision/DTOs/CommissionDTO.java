package com.HolosINC.Holos.commision.DTOs;

import com.HolosINC.Holos.commision.StatusCommision;

import java.util.Date;

import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.EnumPaymentArrangement;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CommissionDTO {

    private Long id;

    private String name;

    private String description;

    private Double price;

    private StatusCommision status;

    private EnumPaymentArrangement paymentArrangement;

    private Date milestoneDate;
    
    private String artistUsername;

    private String clientUsername;

    private byte[] image;

    private byte[] imageProfile;

    public CommissionDTO(Commision commision){
        this.id = commision.getId();
        this.name = commision.getName();
        this.description = commision.getDescription();
        this.price = commision.getPrice();
        this.status = commision.getStatus();
        this.paymentArrangement = commision.getPaymentArrangement();
        this.milestoneDate = commision.getMilestoneDate();
        this.artistUsername = commision.getArtist().getBaseUser().getUsername();
        this.clientUsername = commision.getBaseUser().getUsername();
        this.image = commision.getImage();
        this.imageProfile = commision.getArtist().getBaseUser().getImageProfile();
    }
}

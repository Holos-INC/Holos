package com.HolosINC.Holos.commision.DTOs;

import java.util.Date;

import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.EnumPaymentArrangement;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CommisionDTO {

    public String name;

    public String description;

    public Double price;

    public EnumPaymentArrangement paymentArrangement;
    
    public byte[] image;

    public Date milestoneDate;

    public Commision createCommision() {
        Commision commision = new Commision();
        commision.setName(this.getName());
        commision.setDescription(this.getDescription());
        commision.setPrice(this.getPrice());
        commision.setPaymentArrangement(this.getPaymentArrangement());
        commision.setImage(this.getImage());
        commision.setMilestoneDate(this.getMilestoneDate());
        return commision;
    }
}

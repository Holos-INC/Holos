package com.HolosINC.Holos.commision.DTOs;

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

    public Integer numMilestones;

    public EnumPaymentArrangement paymentArrangement;

    public Commision createCommision() {
        Commision commision = new Commision();
        commision.setName(this.getName());
        commision.setDescription(this.getDescription());
        commision.setPrice(this.getPrice());
        commision.setNumMilestones(this.getNumMilestones());
        commision.setPaymentArrangement(this.getPaymentArrangement());
        return commision;
    }
}

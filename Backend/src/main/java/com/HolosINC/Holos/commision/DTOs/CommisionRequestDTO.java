package com.HolosINC.Holos.commision.DTOs;

import java.util.Date;

import com.HolosINC.Holos.commision.Commision;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CommisionRequestDTO {

    public String name;

    public String description;

    public byte[] image;

    public String milestoneDate;

    public Commision createCommision() {
        Commision commision = new Commision();
        commision.setName(this.getName());
        commision.setDescription(this.getDescription());
        commision.setImage(this.getImage());
        // commision.setMilestoneDate(this.getMilestoneDate());
        return commision;
    }
}

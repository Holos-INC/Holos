package com.HolosINC.Holos.commision.DTOs;

import java.util.Base64;
import java.util.Date;

import com.HolosINC.Holos.commision.Commision;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CommisionRequestDTO {

    public String name;

    public String description;

    public String image;

    public Date milestoneDate;

    public Double price;
    
    public Commision createCommision() {
        Commision commision = new Commision();
        commision.setName(this.getName());
        commision.setDescription(this.getDescription());
        commision.setMilestoneDate(this.getMilestoneDate());
        commision.setPrice(this.getPrice());

        if (image != null && image.contains(",")) {
            String base64Data = image.split(",")[1];
            commision.setImage(Base64.getDecoder().decode(base64Data));
        }

        return commision;
    }
}

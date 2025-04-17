package com.HolosINC.Holos.commision.DTOs;

import java.util.Base64;
import java.util.Date;

import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.EnumPaymentArrangement;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CommisionRequestDTO {

    private String name;

    private String description;

    private String image;

    private Date milestoneDate;

    private Double price;

    private EnumPaymentArrangement paymentArrangement;

    private Integer totalPayments;

    public Commision createCommision() {
        Commision commision = new Commision();
        commision.setName(this.getName());
        commision.setDescription(this.getDescription());
        commision.setMilestoneDate(this.getMilestoneDate());
        commision.setPrice(this.getPrice());
        commision.setPaymentArrangement(this.getPaymentArrangement());
        commision.setTotalPayments(this.getTotalPayments()); // Solo se pasa si es MODERATOR, si no, será null y se manejará en la Entidad con PrePersist y PreUpdate

        if (image != null && image.contains(",")) {
            String base64Data = image.split(",")[1];
            commision.setImage(Base64.getDecoder().decode(base64Data));
        }

        return commision;
    }
}

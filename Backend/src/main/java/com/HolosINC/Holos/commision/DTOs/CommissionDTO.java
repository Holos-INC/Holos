package com.HolosINC.Holos.commision.DTOs;

import com.HolosINC.Holos.commision.StatusCommision;
import com.HolosINC.Holos.commision.UpdateStatus;

import java.util.Date;

import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.EnumPaymentArrangement;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommissionDTO {

    private Long id;

    private String name;

    private String description;

    private Double price;

    private StatusCommision status;

    private EnumPaymentArrangement paymentArrangement;

    private Integer totalPayments;

    private Integer currentPayments;

    private Boolean isWaitingPayment;

    private String setupIntentId;

    private Date milestoneDate;

    private Date acceptedDateByArtist;
    
    private String artistUsername;

    private String clientUsername;

    private byte[] image;

    private byte[] oldImage;

    private byte[] newImage;

    private byte[] imageProfileA;

    private byte[] imageProfileC;

    private UpdateStatus lastUpdateStatus;

    public CommissionDTO(Commision commision){
        this.id = commision.getId();
        this.name = commision.getName();
        this.description = commision.getDescription();
        this.price = commision.getPrice();
        this.status = commision.getStatus();
        this.paymentArrangement = commision.getPaymentArrangement();
        this.totalPayments = commision.getTotalPayments();
        this.currentPayments = commision.getCurrentPayments();
        this.milestoneDate = commision.getMilestoneDate();
        this.acceptedDateByArtist = commision.getAcceptedDateByArtist();
        this.artistUsername = commision.getArtist().getBaseUser().getUsername();
        this.clientUsername = commision.getClient().getBaseUser().getUsername();
        this.image = commision.getImage();
        this.oldImage = commision.getArtistOldImage();
        this.newImage = commision.getArtistNewImage();
        this.imageProfileA = commision.getArtist().getBaseUser().getImageProfile();
        this.imageProfileC = commision.getClient().getBaseUser().getImageProfile();
        this.isWaitingPayment = commision.isWaitingPayment();
        this.setupIntentId = commision.getSetupIntentId();
        this.lastUpdateStatus = commision.getLastUpdateStatus();
    }

    public Commision createCommision() {
        Commision commision = new Commision();
        commision.setId(this.id);
        commision.setName(this.name);
        commision.setDescription(this.description);
        commision.setPrice(this.price);
        commision.setStatus(this.status);
        commision.setPaymentArrangement(this.getPaymentArrangement());
        commision.setTotalPayments(this.getTotalPayments());
        commision.setMilestoneDate(this.milestoneDate);
        commision.setAcceptedDateByArtist(this.acceptedDateByArtist);
        commision.setImage(this.image);
        commision.setArtistOldImage(this.oldImage);
        commision.setArtistNewImage(this.newImage);
        commision.setWaitingPayment(this.isWaitingPayment);
        commision.setLastUpdateStatus(this.lastUpdateStatus);
        return commision;
    }
}

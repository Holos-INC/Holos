package com.HolosINC.Holos.commision.DTOs;

import com.HolosINC.Holos.commision.Commision;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientCommissionDTO {
    
    private Long id;
    private byte[] image;
    private String name;
    private String artistUsername;
    private String clientUsername;   
    private Integer currentStep;
    private Integer totalSteps;
    private byte[] imageProfileArtist;
    private byte[] imageProfileClient;
    private boolean isWaitingPayment;

    public ClientCommissionDTO(byte[] image, String name, String artistUsername,
                                int currentStep, int totalSteps,
                                byte[] imageProfileArtist, byte[] imageProfileClient, boolean isWaitingPayment) {
        this.image = image;
        this.name = name;
        this.artistUsername = artistUsername;
        this.currentStep = currentStep;
        this.totalSteps = totalSteps; 
        this.imageProfileArtist = imageProfileArtist;
        this.imageProfileClient = imageProfileClient;
        this.isWaitingPayment = isWaitingPayment;
    }

    public ClientCommissionDTO(Commision c) {
        this.id = c.getId();
        this.image = c.getImage() != null ? c.getImage() : new byte[0];
        this.name = c.getName();
        this.artistUsername = c.getArtist().getBaseUser().getUsername();
        this.currentStep = c.getStatusKanbanOrder() != null ? c.getStatusKanbanOrder().getOrder() : null;
        this.totalSteps = 0;
        this.clientUsername = c.getClient().getBaseUser().getUsername(); 
        this.imageProfileArtist = c.getArtist().getBaseUser().getImageProfile();
        this.imageProfileClient = c.getClient().getBaseUser().getImageProfile();
        this.isWaitingPayment = c.isWaitingPayment();
    }
}

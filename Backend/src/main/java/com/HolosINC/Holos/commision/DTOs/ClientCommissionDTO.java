package com.HolosINC.Holos.commision.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientCommissionDTO {

    private byte[] image;

    private String name;

    private String artistUsername;

    private Integer currentStep;

    private Integer totalSteps;

    private byte[] imageProfileArtist;

    private byte[] imageProfileClient;

    public ClientCommissionDTO(byte[] image, String name, String artistUsername,
                                int currentStep, int totalSteps,
                                byte[] imageProfileArtist, byte[] imageProfileClient) {
        this.image = image;
        this.name = name;
        this.artistUsername = artistUsername;
        this.currentStep = currentStep;
        this.totalSteps = totalSteps;
        this.imageProfileArtist = imageProfileArtist;
        this.imageProfileClient = imageProfileClient;
    }
}

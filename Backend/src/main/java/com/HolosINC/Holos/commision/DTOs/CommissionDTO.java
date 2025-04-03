package com.HolosINC.Holos.commision.DTOs;

import com.HolosINC.Holos.commision.StatusCommision;

import java.util.Date;

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
}

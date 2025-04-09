package com.HolosINC.Holos.model;

import javax.validation.constraints.Size;

import lombok.Data;

@Data
public class BaseUserDTO {

    @Size(min = 2, max = 255)
    protected String name;

    @Size(min = 2, max = 255)
    protected String username;

    @Size(max = 255)
    protected String email;

    @Size(max = 15)
    protected String phoneNumber;

    private byte[] imageProfile;

    private byte[] tableCommissionsPrice;

}

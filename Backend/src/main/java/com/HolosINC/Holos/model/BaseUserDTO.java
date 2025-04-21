package com.HolosINC.Holos.model;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.HolosINC.Holos.auth.Authorities;

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

    @Size(max = 500)
    private String description;

    private byte[] imageProfile;

    private String authorityName;

}

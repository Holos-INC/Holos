package com.HolosINC.Holos.model;


import javax.validation.constraints.Size;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "base_user")
public class BaseUserDTO {

    //creo que estos atributos son los correctos para manetener
    
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

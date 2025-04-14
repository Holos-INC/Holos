package com.HolosINC.Holos.model;

import java.util.Date;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.HolosINC.Holos.auth.Auth;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "base_user")
public class BaseUser {

    @Id
    @SequenceGenerator(name = "entity_seq", sequenceName = "entity_sequence", initialValue = 500)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "entity_seq")
    protected Long id;

    @Size(min = 2, max = 255)
    @NotNull
    protected String name;

    @Size(min = 2, max = 255)
    @Column(unique = true)
    protected String username;

    @Size(min = 2, max = 255)
    protected String password;

    @Size(max = 255)
    @Column(unique = true)
    @NotNull
    protected String email;

    @Size(max = 15)
    protected String phoneNumber;


    @Enumerated(EnumType.STRING)
    @NotNull
    protected Auth authority;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] imageProfile;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] tableCommissionsPrice;

    @NotNull
    protected Date createdUser;

    protected Date updatedUser;

    protected Date bannedUser;

    protected Integer banTime;
}

package com.HolosINC.Holos.model;

import java.util.Date;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.HolosINC.Holos.auth.Auth;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
    @Column(name = "phone_number")
    protected String phoneNumber;

    @NotNull
    protected Auth authority;

    @Lob
    @Column(name = "image_profile", columnDefinition = "LONGBLOB")
    private byte[] imageProfile;

    @Lob
    @Column(name = "table_commissions", columnDefinition = "LONGBLOB")
    private byte[] tableCommissionsPrice;

    @Column(name = "created_user")
    @NotNull
    protected Date createdUser;

    @Column(name = "updated_user")
    protected Date updatedUser;

    @Column(name = "ban_user")
    protected Date bannedUser;

    @Column(name = "ban_time")
    protected Integer banTime;
}

package com.HolosINC.Holos.artist;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.HolosINC.Holos.model.BaseUser;

import lombok.Data;

@Data
@Entity
@Table(name = "artists")
public class Artist{

    @Id
	@SequenceGenerator(name = "entity_seq", sequenceName = "entity_sequence", initialValue = 500)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "entity_seq")
    protected Long id;

    @NotNull
    @Min(1)
    private Integer numSlotsOfWork;

    private String tableCommisionsPrice;

    @OneToOne(optional = true)
    private BaseUser baseUser;

    // Derivate properties
    @Size(min = 2, max = 255)
    @Column(name = "first_name")
    @NotNull
    private String name;

    @Size(min = 2, max = 255)
    //@Column(unique = true)
    private String username;

    @Size(max = 255)
    //@Column(unique = true)
    @NotNull
    private  String email;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean banned = false;

    @Column(nullable = true)
    private LocalDateTime bannedUntil;
}

package com.HolosINC.Holos.artist;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

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

    private String sellerAccountId;

    private String subscriptionId;

    @Lob
    @Column(name = "tableCommisionsPrice", columnDefinition = "LONGBLOB")
    private byte[] tableCommisionsPrice;

    @Size(max = 500)
    private String description;

    @Size(max = 100)
    private String linkToSocialMedia;

    @OneToOne(optional = true)
    private BaseUser baseUser;
}

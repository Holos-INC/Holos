package com.HolosINC.Holos.milestone;

import java.sql.Date;

import com.HolosINC.Holos.commision.Commision;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Table(name = "milestones")
@Entity
public class Milestone {

    @Id
    @SequenceGenerator(name = "entity_seq", sequenceName = "entity_sequence", initialValue = 100)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "entity_seq")
    private Long id;

    private String name;
    private Boolean accepted;
    private Date milestoneDate;

    @ManyToOne
    private Commision commision;
}

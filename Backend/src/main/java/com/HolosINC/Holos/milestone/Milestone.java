package com.HolosINC.Holos.milestone;

import java.util.Date;

import com.HolosINC.Holos.commision.Commision;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@Table(name = "milestones")
@Entity
public class Milestone{
    
    @Id
	@SequenceGenerator(name = "entity_seq", sequenceName = "entity_sequence", initialValue = 500)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "entity_seq")
	protected Long id;

    @Size(max = 50)
    private String name;
    
    @NotNull
    private Boolean accepted;
    
    @NotNull
    private Date milestoneDate;

    @ManyToOne
    @JoinColumn(name = "commision_id")
    private Commision commision;
}

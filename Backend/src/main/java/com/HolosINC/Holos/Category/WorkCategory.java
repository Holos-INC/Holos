package com.HolosINC.Holos.Category;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import com.HolosINC.Holos.work.Work;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@EqualsAndHashCode(callSuper = false)

@Table(uniqueConstraints = @UniqueConstraint(columnNames = { "work_id", "category_id"}))
public class WorkCategory{
    
    @Id
	@SequenceGenerator(name = "entity_seq", sequenceName = "entity_sequence", initialValue = 500)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "entity_seq")
	protected Long id;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Work work;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Category category;
}

package com.HolosINC.Holos.Kanban;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;

import javax.validation.constraints.NotNull;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import com.HolosINC.Holos.artist.Artist;

@Data
@Entity
@Table(name = "status_kanban_order", uniqueConstraints = @UniqueConstraint(columnNames = { "artist_id", "order_in_kanban"}))
public class StatusKanbanOrder{
    
    @Id
	@SequenceGenerator(name = "entity_seq", sequenceName = "entity_sequence", initialValue = 500)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "entity_seq")
	protected Long id;

    @NotNull
    @Column(nullable = false)
    private String name;

    @NotNull
    @Column(name = "order_in_kanban")
    private Integer order;

    private String description;

    @NotNull
    private String color;

    @ManyToOne
    @JoinColumn(name = "artist_id", referencedColumnName = "id",  nullable = false)
    private Artist artist;
}
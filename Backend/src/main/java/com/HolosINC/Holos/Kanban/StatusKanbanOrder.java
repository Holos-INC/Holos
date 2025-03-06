package com.HolosINC.Holos.Kanban;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.HolosINC.Holos.artist.Artist;

@Data
@Entity
@Table(name = "status_kanban_order", uniqueConstraints = @UniqueConstraint(columnNames = { "artist_id", "order"}))
public class StatusKanbanOrder {

    @Id
	@SequenceGenerator(name = "entity_seq", sequenceName = "entity_sequence", initialValue = 100)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "entity_seq")
	protected Long id;

    @NotNull
    @Column(nullable = false)
    private String name;

    @NotNull
    @Column(name = "kanban_order")
    private Integer order;

    private String description;

    @NotNull
    //@Pattern(regexp = "^#([A-Fa-f0-9]{6})$")
    private String color;

    @ManyToOne(optional = false)
    @JoinColumn(name = "artist_id")
    private Artist artist;
}
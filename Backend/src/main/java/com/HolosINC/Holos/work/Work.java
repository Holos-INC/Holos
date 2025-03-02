package com.HolosINC.Holos.work;

import com.HolosINC.Holos.artist.Artist;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "works")
@Data
@Inheritance(strategy = InheritanceType.JOINED)
public class Work {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Double price;

    // @ManyToOne
    // @JoinColumn(name = "category_id")
    // private Category category;
    
    @ManyToOne
    @JoinColumn(name = "artist_id", nullable = false)
    private Artist artist;
}

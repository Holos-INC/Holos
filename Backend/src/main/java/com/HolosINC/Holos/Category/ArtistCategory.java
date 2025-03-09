package com.HolosINC.Holos.Category;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.model.BaseEntity;

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
@Table(uniqueConstraints = @UniqueConstraint(columnNames = { "artist_id", "category_id"}))
public class ArtistCategory extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "artist_id", nullable = false)
    private Artist artist;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}

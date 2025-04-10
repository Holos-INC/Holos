package com.HolosINC.Holos.search.DTOs;

import com.HolosINC.Holos.worksdone.WorksDone;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SearchWorkDTO {

    private Long id;

    private byte[] image;

    private String name;

    private Double price;

    private String description;

    private String artistUsername;

    public SearchWorkDTO(WorksDone worksDone) {
        this.id = worksDone.getId();
        this.image = worksDone.getImage();
        this.name = worksDone.getName();
        this.price = worksDone.getPrice();
        this.description = worksDone.getDescription();
        this.artistUsername = worksDone.getArtist().getBaseUser().getUsername();
    }
}

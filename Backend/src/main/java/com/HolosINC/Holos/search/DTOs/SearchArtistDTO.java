package com.HolosINC.Holos.search.DTOs;

import com.HolosINC.Holos.artist.Artist;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SearchArtistDTO {
    private Long id;
    private String username;
    private byte[] imageProfile;
    private String name;
    private boolean isPremium;

    public SearchArtistDTO(Artist artist) {
        this.id = artist.getId();
        this.username = artist.getBaseUser().getUsername();
        this.imageProfile = artist.getBaseUser().getImageProfile();
        this.name = artist.getBaseUser().getName();
        this.isPremium = artist.getBaseUser().getAuthority().name().equals("ARTIST_PREMIUM");
    }
}

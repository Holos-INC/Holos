package com.HolosINC.Holos.artist;

import com.HolosINC.Holos.model.BaseUserDTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper=false)
@NoArgsConstructor
public class ArtistDTO extends BaseUserDTO {
   
    @NotNull
    @Min(1)
    private Integer numSlotsOfWork;

    private String sellerAccountId;

    private byte[] tableCommisionsPrice;
    
    private String description;
    
    private String linkToSocialMedia;

    private Long artistId;
}

/*
    private Long artistId;
    private Long baseUserId;

    private String name;
    private String username;
    private String email;
    private String phoneNumber;

    private byte[] imageProfile;
    private Integer numSlotsOfWork;
    private byte[] tableCommisionsPrice;
    private String description;
    private String linkToSocialMedia;
*/

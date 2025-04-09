package com.HolosINC.Holos.artist;

import com.HolosINC.Holos.model.BaseUserDTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArtistDTO extends BaseUserDTO {
   
    @NotNull
    @Min(1)
    private Integer numSlotsOfWork;

    private String sellerAccountId;

    private byte[] tableCommisionsPrice;
    
    private Long artistId;
}

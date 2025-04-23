package com.HolosINC.Holos.artist;

import com.HolosINC.Holos.model.BaseUserDTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
    
    @Size(max = 500)
    private String description;
    
    @Size(max = 100)
    private String linkToSocialMedia;

    @NotNull
    private Long artistId;
}

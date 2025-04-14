package com.HolosINC.Holos.Profile;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserDTO;
import com.HolosINC.Holos.model.BaseUserService;
import com.HolosINC.Holos.util.EntityToDTOMapper;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private BaseUserService baseUserService;
    private ArtistService artistService;

    public ProfileService(BaseUserService baseUserService, ArtistService artistService) {
        this.baseUserService = baseUserService;
        this.artistService = artistService;
    }

    @Transactional
    public BaseUserDTO updateProfile(BaseUserDTO baseUserDTO) throws Exception {
        BaseUser currentUser = baseUserService.findCurrentUser();
        Artist artist = artistService.findArtist(currentUser.getId());

        if (artist != null) {
            artist.getBaseUser().setName(baseUserDTO.getName());
            artist.getBaseUser().setEmail(baseUserDTO.getEmail());
            artist.getBaseUser().setPhoneNumber(baseUserDTO.getPhoneNumber());
            artist.getBaseUser().setImageProfile(baseUserDTO.getImageProfile());

            artistService.saveArtist(artist);
            return EntityToDTOMapper.toArtistDTO(artist);
        }

        return EntityToDTOMapper.toBaseUserDTO(currentUser);
    }
}

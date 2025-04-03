package com.HolosINC.Holos.Profile;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserDTO;
import com.HolosINC.Holos.model.BaseUserService;
import com.HolosINC.Holos.util.EntityToDTOMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {
    @Autowired
    private BaseUserService baseUserService;

    @Autowired
    private ArtistService artistService;

    @Transactional
    public BaseUserDTO updateProfile(BaseUserDTO baseUserDTO) {
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

        // Si no es un artista, intentamos encontrarlo como cliente
        BaseUser client = baseUserService.findCurrentUser();
        if (client != null) {
            // Si encontramos al cliente, actualizamos los datos del cliente
            client.setName(baseUserDTO.getName());
            client.setEmail(baseUserDTO.getEmail());
            client.setPhoneNumber(baseUserDTO.getPhoneNumber());
            client.setImageProfile(baseUserDTO.getImageProfile());

            baseUserService.save(client);
            return EntityToDTOMapper.toBaseUserDTO(client);
        }

        throw new RuntimeException("User type is not recognized.");
    }
}

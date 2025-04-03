package com.HolosINC.Holos.Profile;

import com.HolosINC.Holos.client.Client;
import com.HolosINC.Holos.client.ClientService;
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

    @Autowired
    private ClientService clientService;

    @Transactional
    public BaseUserDTO updateProfile(BaseUserDTO baseUserDTO) {
        // Verificamos que el usuario que está haciendo la solicitud sea el usuario
        // actual
        BaseUser currentUser = baseUserService.findCurrentUser();

        Artist artist = artistService.findArtist(currentUser.getId());
        if (artist != null) {
            // Si encontramos al artista, actualizamos los datos del artista
            artist.getBaseUser().setName(baseUserDTO.getName());
            artist.getBaseUser().setEmail(baseUserDTO.getEmail());
            artist.getBaseUser().setPhoneNumber(baseUserDTO.getPhoneNumber());
            artist.getBaseUser().setImageProfile(baseUserDTO.getImageProfile());

            artistService.saveArtist(artist);
            return EntityToDTOMapper.toArtistDTO(
                    artist);
        }

        // Si no es un artista, intentamos encontrarlo como cliente
        Client client = clientService.findClient(currentUser.getId());
        if (client != null) {
            // Si encontramos al cliente, actualizamos los datos del cliente
            client.getBaseUser().setName(baseUserDTO.getName());
            client.getBaseUser().setEmail(baseUserDTO.getEmail());
            client.getBaseUser().setPhoneNumber(baseUserDTO.getPhoneNumber());
            client.getBaseUser().setImageProfile(baseUserDTO.getImageProfile());

            clientService.saveClient(client);
            return EntityToDTOMapper.toClientDTO(
                    client);
        }

        throw new RuntimeException("User type is not recognized.");
    }
}

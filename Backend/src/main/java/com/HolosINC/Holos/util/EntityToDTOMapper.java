package com.HolosINC.Holos.util;

import com.HolosINC.Holos.artist
.Artist;
import com.HolosINC.Holos.artist
.ArtistDTO;
import com.HolosINC.Holos.client.Client;
import com.HolosINC.Holos.client.ClientDTO;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserDTO;



public class EntityToDTOMapper {
    


public static ArtistDTO toArtistDTO(Artist artist) {
    ArtistDTO artistDTO = new ArtistDTO();
    artistDTO.setName(artist.getBaseUser().getName());
    artistDTO.setUsername(artist.getBaseUser().getUsername());
    artistDTO.setEmail(artist.getBaseUser().getEmail());
    artistDTO.setPhoneNumber(artist.getBaseUser().getPhoneNumber());
    artistDTO.setImageProfile(artist.getBaseUser().getImageProfile());
    artistDTO.setTableCommissionsPrice(artist.getTableCommisionsPrice());
    artistDTO.setNumSlotsOfWork(artist.getNumSlotsOfWork());
    return artistDTO;
}

public static ClientDTO toClientDTO(Client client) {
    ClientDTO clientDTO = new ClientDTO();
    clientDTO.setName(client.getBaseUser().getName());
    clientDTO.setUsername(client.getBaseUser().getUsername());
    clientDTO.setEmail(client.getBaseUser().getEmail());
    clientDTO.setPhoneNumber(client.getBaseUser().getPhoneNumber());
    clientDTO.setImageProfile(client.getBaseUser().getImageProfile());
    return clientDTO;
}
public static BaseUserDTO toBaseUserDTO(BaseUser baseUser) {
        BaseUserDTO baseUserDTO = new BaseUserDTO();
        baseUserDTO.setName(baseUser.getName());
        baseUserDTO.setUsername(baseUser.getUsername());
        baseUserDTO.setEmail(baseUser.getEmail());
        baseUserDTO.setPhoneNumber(baseUser.getPhoneNumber());
        baseUserDTO.setImageProfile(baseUser.getImageProfile());
        baseUserDTO.setTableCommissionsPrice(baseUser.getTableCommissionsPrice());
        return baseUserDTO;
    }



}

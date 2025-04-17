package com.HolosINC.Holos.artist;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.HolosINC.Holos.Profile.ProfileService;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.nio.file.AccessDeniedException;

public class ArtistRestControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ArtistService artistService;

    @Mock
    private ProfileService profileService;

    @InjectMocks
    private ArtistRestController artistRestController;

    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(artistRestController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    public void testFindByIdSuccess() throws Exception {
        Artist artist = new Artist();
        artist.setId(1L);
        artist.setNumSlotsOfWork(5);
        // artist.setDescription("Artista especializado en retratos");

        BaseUser baseUser = new BaseUser();
        baseUser.setName("Artista 1");
        baseUser.setUsername("artista1");
        baseUser.setEmail("artista1@example.com");
        baseUser.setPhoneNumber("123456789");
        baseUser.setImageProfile(new byte[0]);

        artist.setBaseUser(baseUser);

        when(artistService.findArtist(1L)).thenReturn(artist);

        mockMvc.perform(get("/api/v1/artists/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.artistId").value(1))
                .andExpect(jsonPath("$.numSlotsOfWork").value(5))
                .andExpect(jsonPath("$.description").value("Artista especializado en retratos"))
                .andExpect(jsonPath("$.username").value("artista1"));

        verify(artistService, times(1)).findArtist(1L);
    }

    @Test
    public void testFindByIdNotFound() throws Exception {
        when(artistService.findArtist(1L)).thenThrow(new ResourceNotFoundException("Artist", "id", 1L));

        mockMvc.perform(get("/api/v1/artists/1"))
                .andExpect(status().isBadRequest());

        verify(artistService, times(1)).findArtist(1L);
    }

    @Test
    public void testFindByUsernameSuccess() throws Exception {
        Artist artist = new Artist();
        artist.setId(1L);
        artist.setBaseUser(new BaseUser());
        artist.getBaseUser().setUsername("artistUsername");

        when(artistService.findArtistByUsername("artistUsername")).thenReturn(artist);

        mockMvc.perform(get("/api/v1/artists/username/artistUsername"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.baseUser.username").value("artistUsername"));

        verify(artistService, times(1)).findArtistByUsername("artistUsername");
    }

    @Test
    public void testFindByUsernameNotFound() throws Exception {
        when(artistService.findArtistByUsername("artistUsername"))
                .thenThrow(new ResourceNotFoundException("Artist", "username", "artistUsername"));

        mockMvc.perform(get("/api/v1/artists/username/artistUsername"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Artist not found with username: artistUsername"));

        verify(artistService, times(1)).findArtistByUsername("artistUsername");
    }

    @Test
    public void testDeleteArtistSuccess() throws Exception {
        doNothing().when(artistService).deleteArtist(1L);

        mockMvc.perform(delete("/api/v1/artists/administrator/artists/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Artista eliminado con exito"));

        verify(artistService, times(1)).deleteArtist(1L);
    }

    @Test
    public void testDeleteArtistNotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Artist", "id", 1L)).when(artistService).deleteArtist(1L);

        mockMvc.perform(delete("/api/v1/artists/administrator/artists/1"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Artist not found with id: 1"));

        verify(artistService, times(1)).deleteArtist(1L);
    }

    @Test
    public void testDeleteArtistAccessDenied() throws Exception {
        doThrow(new AccessDeniedException(
                "No se puede eliminar al artista porque tiene comisiones en estado ACCEPTED."))
                .when(artistService).deleteArtist(1L);

        mockMvc.perform(delete("/api/v1/artists/administrator/artists/1"))
                .andExpect(status().isBadRequest());

        verify(artistService, times(1)).deleteArtist(1L);
    }

    @Test
    public void testUpdateProfileSuccess() throws Exception {
        BaseUserDTO baseUserDTO = new BaseUserDTO();
        baseUserDTO.setUsername("updatedUsername");

        when(profileService.updateProfile(any(BaseUserDTO.class))).thenReturn(baseUserDTO);

        mockMvc.perform(put("/api/v1/artists/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(baseUserDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("updatedUsername"));

        verify(profileService, times(1)).updateProfile(any(BaseUserDTO.class));
    }
}

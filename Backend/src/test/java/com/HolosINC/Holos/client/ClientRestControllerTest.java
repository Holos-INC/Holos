package com.HolosINC.Holos.client;

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
import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.auth.Authorities;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserDTO;
import com.HolosINC.Holos.model.BaseUserService;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ClientRestControllerTest {
    private MockMvc mockMvc;

    @Mock
    private ClientService clientService;

    @Mock
    private BaseUserService userService;

    @Mock
    private ProfileService profileService;

    @InjectMocks
    private ClientRestController clientRestController;

    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(clientRestController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    public void testFindByIdSuccess() throws Exception {
        Client client = new Client();
        client.setId(1L);

        when(clientService.findClient(1L)).thenReturn(client);

        mockMvc.perform(get("/api/v1/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(clientService, times(1)).findClient(1L);
    }

    @Test
    public void testFindByIdNotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Client", "id", 1L))
                .when(clientService).findClient(1L);

        mockMvc.perform(get("/api/v1/users/1"))
                .andExpect(status().isNotFound())
                .andExpect(content().string(""));

        verify(clientService, times(1)).findClient(1L);
    }

    @Test
    public void testDeleteClientSuccess() throws Exception {
        doNothing().when(clientService).deleteClient(1L);

        mockMvc.perform(delete("/api/v1/users/administrator/clients/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Cliente eliminado exitosamente"));

        verify(clientService, times(1)).deleteClient(1L);
    }

    @Test
    public void testDeleteClientNotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Client", "userId", 1L))
                .when(clientService).deleteClient(1L);

        mockMvc.perform(delete("/api/v1/users/administrator/clients/1"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error: Client not found with userId: 1"));

        verify(clientService, times(1)).deleteClient(1L);
    }

    @Test
    public void testDeleteClientWithActiveCommissions() throws Exception {
        BaseUser baseUser = new BaseUser();
        baseUser.setId(1L);
        baseUser.setUsername("usuario_prueba");
        Client client = new Client();
        client.setId(1L);
        client.setBaseUser(baseUser);

        doThrow(new IllegalStateException("No se puede eliminar el cliente " + client.getBaseUser().getUsername() +
                " porque tiene comisiones activas."))
                .when(clientService).deleteClient(1L);

        mockMvc.perform(delete("/api/v1/users/administrator/clients/1"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(
                        "Error interno al eliminar el cliente: No se puede eliminar el cliente usuario_prueba porque tiene comisiones activas."));

        verify(clientService, times(1)).deleteClient(1L);
    }

    @Test
    public void testFindByUserIdSuccess() throws Exception {
        Client client = new Client();
        client.setId(1L);
        BaseUser user = new BaseUser();
        user.setId(1L);
        client.setBaseUser(user);

        when(clientService.findClientByUserId(1L)).thenReturn(client);

        mockMvc.perform(get("/api/v1/users/byBaseUser/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(clientService, times(1)).findClientByUserId(1L);
    }

    @Test
    public void testFindByUserIdNotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Client", "userId", 1L))
                .when(clientService).findClientByUserId(1L);

        mockMvc.perform(get("/api/v1/users/byBaseUser/1"))
                .andExpect(status().isNotFound())
                .andExpect(content().string(""));

        verify(clientService, times(1)).findClientByUserId(1L);
    }

    @Test
    public void testProfileOfCurrentUserAsClient() throws Exception {
        BaseUser user = new BaseUser();
        user.setId(1L);
        Authorities auth = new Authorities();
        auth.setId(1L);
        auth.setAuthority("CLIENT");
        user.setAuthority(auth);
        when(userService.findCurrentUser()).thenReturn(user);
        when(userService.findClient(1L)).thenReturn(new Client());

        mockMvc.perform(get("/api/v1/users/profile"))
                .andExpect(status().isOk())
                .andExpect(content().json("{}"));

        verify(userService, times(1)).findCurrentUser();
        verify(userService, times(1)).findClient(1L);
    }

    @Test
    public void testProfileOfCurrentUserAsArtist() throws Exception {
        BaseUser user = new BaseUser();
        user.setId(2L);
        Authorities auth = new Authorities();
        auth.setId(1L);
        auth.setAuthority("ARTIST");
        user.setAuthority(auth);
        when(userService.findCurrentUser()).thenReturn(user);
        when(userService.findArtist(2L)).thenReturn(new Artist());

        mockMvc.perform(get("/api/v1/users/profile"))
                .andExpect(status().isOk())
                .andExpect(content().json("{}"));

        verify(userService, times(1)).findCurrentUser();
        verify(userService, times(1)).findArtist(2L);
    }

    @Test
    public void testProfileOfCurrentUserAsArtistPremium() throws Exception {
        BaseUser user = new BaseUser();
        user.setId(2L);
        Authorities auth = new Authorities();
        auth.setId(1L);
        auth.setAuthority("ARTIST_PREMIUM");
        user.setAuthority(auth);
        when(userService.findCurrentUser()).thenReturn(user);
        when(userService.findArtist(2L)).thenReturn(new Artist());

        mockMvc.perform(get("/api/v1/users/profile"))
                .andExpect(status().isOk())
                .andExpect(content().json("{}"));

        verify(userService, times(1)).findCurrentUser();
        verify(userService, times(1)).findArtist(2L);
    }

    @Test
    public void testProfileOfCurrentUserWithError() throws Exception {
        when(userService.findCurrentUser()).thenThrow(new ResourceNotFoundException("No estás logeado"));

        mockMvc.perform(get("/api/v1/users/profile"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("No tienes perfil, tienes que loguearte"));

        verify(userService, times(1)).findCurrentUser();
    }

    @Test
    public void testUpdateProfileSuccess() throws Exception {
        BaseUserDTO baseUserDTO = new BaseUserDTO();
        baseUserDTO.setUsername("updatedUsername");

        when(profileService.updateProfile(any(BaseUserDTO.class))).thenReturn(baseUserDTO);

        mockMvc.perform(put("/api/v1/users/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(baseUserDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("updatedUsername"));

        verify(profileService, times(1)).updateProfile(any(BaseUserDTO.class));
    }
    @Test
public void testUpdateProfileFailure() throws Exception {
    BaseUserDTO baseUserDTO = new BaseUserDTO();
    baseUserDTO.setUsername("updatedUsername");

    // Simulando un error en el servicio de perfil
    when(profileService.updateProfile(any(BaseUserDTO.class))).thenThrow(new RuntimeException("Error actualizando el perfil"));

    mockMvc.perform(put("/api/v1/users/update")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(baseUserDTO)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Error interno al actualizar el perfil: Error actualizando el perfil"));

    verify(profileService, times(1)).updateProfile(any(BaseUserDTO.class));
}


}

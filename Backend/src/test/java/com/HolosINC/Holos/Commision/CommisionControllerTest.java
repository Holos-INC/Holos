package com.HolosINC.Holos.Commision;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

import com.HolosINC.Holos.commision.DTOs.CommissionDTO;
import com.HolosINC.Holos.commision.DTOs.HistoryCommisionsDTO;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.CommisionController;
import com.HolosINC.Holos.commision.CommisionService;

import com.HolosINC.Holos.commision.DTOs.CommisionRequestDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.HolosINC.Holos.client.Client;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

public class CommisionControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CommisionService commisionService;

    @InjectMocks
    private CommisionController commisionController;

    private ObjectMapper objectMapper;

    private static final Long COMMISION_ID = 12345L;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(commisionController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    public void testCreateCommisionSuccess() throws Exception {

        CommisionRequestDTO commisionRequestDTO = new CommisionRequestDTO(
                "Test Commision",
                "Description of the test commission",
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA", // Base64 simulada
                new java.util.Date(),
                100.0);

        BaseUser clientUser = new BaseUser();
        clientUser.setUsername("client_user");

        BaseUser artistUser = new BaseUser();
        artistUser.setUsername("artist_user");

        Client client = new Client();
        client.setBaseUser(clientUser);

        Artist artist = new Artist();
        artist.setBaseUser(artistUser);

        Commision createdCommision = new Commision();
        createdCommision.setId(COMMISION_ID);
        createdCommision.setName("Test Commision");
        createdCommision.setDescription("Description of the test commission");
        createdCommision.setPrice(100.0);
        createdCommision.setClient(client);
        createdCommision.setArtist(artist);

        when(commisionService.createCommision(any(CommisionRequestDTO.class), eq(COMMISION_ID)))
                .thenReturn(new CommissionDTO(createdCommision));

        mockMvc.perform(post("/api/v1/commisions/{id}", COMMISION_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(commisionRequestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(COMMISION_ID))
                .andDo(result -> System.out.println("Response content: " + result.getResponse().getContentAsString()));

        verify(commisionService, times(1)).createCommision(any(CommisionRequestDTO.class), eq(COMMISION_ID));
    }

    @Test
    public void testCreateCommisionBadRequest() throws Exception { // revisar

        CommisionRequestDTO commisionRequestDTO = new CommisionRequestDTO(
                "Test Commision",
                "Description of the test commission",
                "image/coolImage.png",
                new java.util.Date(),
                100.0);

        // Simulando una excepción de tipo IllegalArgumentException
        when(commisionService.createCommision(any(CommisionRequestDTO.class), eq(COMMISION_ID)))
                .thenThrow(new IllegalArgumentException("Invalid input"));

        // Ejecutar la prueba
        mockMvc.perform(post("/api/v1/commisions/" + COMMISION_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(commisionRequestDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid input")).andDo(result -> {
                    System.out.println("Response content: " + result.getResponse().getContentAsString());
                });

        verify(commisionService, times(1)).createCommision(any(CommisionRequestDTO.class), eq(COMMISION_ID));
    }

    @Test
    public void testGetHistoryOfCommisionsSuccess() throws Exception {
        HistoryCommisionsDTO history = new HistoryCommisionsDTO();
        history.setRequested(List.of());
        history.setAccepted(List.of());
        history.setHistory(List.of());

        when(commisionService.getHistoryOfCommissions()).thenReturn(history);

        mockMvc.perform(get("/api/v1/commisions/historyOfCommisions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.requested").isArray())
                .andExpect(jsonPath("$.accepted").isArray())
                .andExpect(jsonPath("$.history").isArray())
                .andDo(result -> {
                    System.out.println("Response content: " + result.getResponse().getContentAsString());
                });

        verify(commisionService, times(1)).getHistoryOfCommissions();
    }

    @Test
    public void testGetCommisionByIdSuccess() throws Exception {
        // Dado
        Long Identifier = 12345L;
        Commision commision1 = new Commision();
        commision1.setId(Identifier);
        commision1.setName("Commission 1");
        commision1.setDescription("Description of Commission 1");
        commision1.setPrice(100.0);

        // Mock Artist + BaseUser
        Artist artist = new Artist();
        BaseUser artistUser = new BaseUser();
        artistUser.setUsername("artistUser");
        artist.setBaseUser(artistUser);
        commision1.setArtist(artist);

        // Mock Client + BaseUser
        Client client = new Client();
        BaseUser clientUser = new BaseUser();
        clientUser.setUsername("clientUser");
        client.setBaseUser(clientUser);
        commision1.setClient(client);

        // Simular el comportamiento del servicio
        when(commisionService.getCommisionById(COMMISION_ID)).thenReturn(new CommissionDTO(commision1));

        // Ejecutar la prueba
        mockMvc.perform(get("/api/v1/commisions/" + COMMISION_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(COMMISION_ID))
                .andDo(result -> {
                    System.out.println("Response content: " + result.getResponse().getContentAsString());
                });

        verify(commisionService, times(1)).getCommisionById(COMMISION_ID);
    }

    @Test
    public void testGetCommisionByIdNotFound() throws Exception {
        // Simula que el servicio lanza una excepción de recurso no encontrado
        when(commisionService.getCommisionById(COMMISION_ID))
                .thenThrow(new ResourceNotFoundException("Commision", "id", COMMISION_ID));

        // Ejecutar la prueba
        mockMvc.perform(get("/api/v1/commisions/" + COMMISION_ID))
                .andExpect(status().isNotFound())
                .andExpect(content().string(""));

        verify(commisionService, times(1)).getCommisionById(COMMISION_ID);
    }

    @Test
    public void testCancelCommisionSuccess() throws Exception {
        // Simulando el comportamiento del servicio
        doNothing().when(commisionService).cancelCommission(COMMISION_ID);

        // Ejecutar la prueba
        mockMvc.perform(put("/api/v1/commisions/" + COMMISION_ID + "/cancel"))
                .andExpect(status().isOk())
                .andExpect(content().string("Comisión cancelada correctamente."));

        verify(commisionService, times(1)).cancelCommission(COMMISION_ID);
    }
    @Test
public void testChangeRequestedCommisionBadRequest() throws Exception {
    CommissionDTO commissionDTO = new CommissionDTO();
    commissionDTO.setName("Test Commission");
    commissionDTO.setDescription("Updated description");

    // Simulamos un error en el servicio
    when(commisionService.requestChangesCommision(any(CommissionDTO.class), eq(COMMISION_ID)))
            .thenThrow(new IllegalArgumentException("Invalid commission details"));

    mockMvc.perform(put("/api/v1/commisions/{commisionId}/requestChanges", COMMISION_ID)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(commissionDTO)))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Invalid commission details"))
            .andDo(result -> {
                System.out.println("Response content: " + result.getResponse().getContentAsString());
            });

    verify(commisionService, times(1)).requestChangesCommision(any(CommissionDTO.class), eq(COMMISION_ID));
}

@Test
public void testToPayCommissionSuccess() throws Exception {
    // Simulamos el pago correctamente
    doNothing().when(commisionService).toPayCommission(COMMISION_ID);

    mockMvc.perform(put("/api/v1/commisions/{commissionId}/toPay", COMMISION_ID))
            .andExpect(status().isOk())
            .andExpect(content().string("Se aceptó el precio correctamente."))
            .andDo(result -> {
                System.out.println("Response content: " + result.getResponse().getContentAsString());
            });

    verify(commisionService, times(1)).toPayCommission(COMMISION_ID);
}


}

package com.HolosINC.Holos.Commision;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

import com.HolosINC.Holos.commision.DTOs.CommissionDTO;
import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.CommisionController;
import com.HolosINC.Holos.commision.CommisionService;
import com.HolosINC.Holos.commision.EnumPaymentArrangement;
import com.HolosINC.Holos.commision.StatusCommision;
import com.HolosINC.Holos.commision.DTOs.CommisionRequestDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
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
    // Prepara los datos para la solicitud
    CommisionRequestDTO commisionRequestDTO = new CommisionRequestDTO(
            "Test Commision",
            "Description of the test commission",
            "image/coolImage.png",
            new java.util.Date(),
            100.0
    );

    // Crea el objeto de respuesta esperado
    Commision createdCommision = new Commision();
    createdCommision.setId(COMMISION_ID);  // Asignamos un ID simulado para la comisión creada

    // Configura el mock del servicio para devolver el objeto creado cuando se invoque el método 'createCommision'
    when(commisionService.createCommision(any(CommisionRequestDTO.class), eq(COMMISION_ID)))
            .thenReturn(new CommissionDTO(createdCommision));

    // Ejecuta la prueba y verifica el comportamiento
    mockMvc.perform(post("/api/v1/commisions/{id}", COMMISION_ID)  // Usando el {id} para pasar el ID de manera más clara
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(commisionRequestDTO)))  // Convertimos el DTO a JSON
            .andExpect(status().isOk())  // Esperamos un 200 OK
            .andExpect(jsonPath("$.id").value(COMMISION_ID))  // Verificamos que el ID en la respuesta sea el esperado
            .andDo(result -> {
                // Imprime la respuesta completa en la consola para depuración
                System.out.println("Response content: " + result.getResponse().getContentAsString());
            });

    // Verifica que el servicio fue llamado exactamente una vez con los parámetros esperados
    verify(commisionService, times(1)).createCommision(any(CommisionRequestDTO.class), eq(COMMISION_ID));
}

    @Test
    public void testCreateCommisionBadRequest() throws Exception { // revisar
        
        CommisionRequestDTO commisionRequestDTO = new CommisionRequestDTO(
                "Test Commision",
                "Description of the test commission",
                "image/coolImage.png",
                new java.util.Date(),
                100.0
        );
        

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
    public void testGetAllCommisionsSuccess() throws Exception {
        // Dado
        Commision commision1 = new Commision();
        commision1.setId(1234L); //Asigna un valor a la ID
        commision1.setName("Commission 1");
        commision1.setDescription("Description of Commission 1");
        commision1.setPrice(100.0);
        
        Commision commision2 = new Commision();
        commision2.setId(2345L);  // Asigna un valor a la ID
        commision2.setName("Commission 2");
        commision2.setDescription("Description of Commission 2");
        commision2.setPrice(200.0);
    
        List<Commision> commisions = List.of(commision1, commision2);
    
        // Simulando el comportamiento del servicio
        when(commisionService.getAllCommisions()).thenReturn(commisions);
    
        // Ejecutar la prueba
        mockMvc.perform(get("/api/v1/commisions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andDo(result -> {
                    // Imprimir el contenido de la respuesta en la consola
                    System.out.println("Response content: " + result.getResponse().getContentAsString());
                });
    
        verify(commisionService, times(1)).getAllCommisions();
    }

    @Test
    public void testGetCommisionByIdSuccess() throws Exception {
        // Dado
        Long Identifier = 12345L;
        Commision commision1 = new Commision();
        commision1.setId(Identifier); //Asigna un valor a la ID
        commision1.setName("Commission 1");
        commision1.setDescription("Description of Commission 1");
        commision1.setPrice(100.0);
        

        // Simulando el comportamiento del servicio
        when(commisionService.getCommisionById(COMMISION_ID)).thenReturn(new CommissionDTO(commision1));

        // Ejecutar la prueba
        mockMvc.perform(get("/api/v1/commisions/" + COMMISION_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(COMMISION_ID)).andDo(result -> {
                        // Imprimir el contenido de la respuesta en la consola
                        System.out.println("Response content: " + result.getResponse().getContentAsString());
                    });
        ;

        verify(commisionService, times(1)).getCommisionById(COMMISION_ID);
    }

    @Test
    public void testGetCommisionByIdNotFound() throws Exception {
        // Simulando que no se encuentra la comisión
        when(commisionService.getCommisionById(COMMISION_ID)).thenReturn(null);

        // Ejecutar la prueba
        mockMvc.perform(get("/api/v1/commisions/" + COMMISION_ID))
                .andExpect(status().isNotFound())
                .andExpect(content().string(""));

        verify(commisionService, times(1)).getCommisionById(COMMISION_ID);
    }

    @Test
    public void testUpdateCommisionStatusSuccess() throws Exception {
        // Dado
        Commision updatedCommision = new Commision();
        updatedCommision.setId(COMMISION_ID);

        // Simulando el comportamiento del servicio
        when(commisionService.updateCommisionStatus(COMMISION_ID, true)).thenReturn(updatedCommision);

        // Ejecutar la prueba
        mockMvc.perform(put("/api/v1/commisions/" + COMMISION_ID + "/status?accept=true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(COMMISION_ID));

        verify(commisionService, times(1)).updateCommisionStatus(COMMISION_ID, true);
    }

    @Test
    public void testCancelCommisionSuccess() throws Exception {
        // Simulando el comportamiento del servicio
        doNothing().when(commisionService).cancelCommission(COMMISION_ID);

        // Ejecutar la prueba
        mockMvc.perform(put("/api/v1/commisions/cancel/" + COMMISION_ID + "?clientId=" + COMMISION_ID))
                .andExpect(status().isOk())
                .andExpect(content().string("Comisión cancelada correctamente."));

        verify(commisionService, times(1)).cancelCommission(COMMISION_ID);
    }
}

package com.HolosINC.Holos.stripe;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.client.Client;
import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.CommisionRepository;
import com.HolosINC.Holos.exceptions.AccessDeniedException;
import com.HolosINC.Holos.exceptions.BadRequestException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.exception.ApiException;
import com.stripe.model.PaymentIntent;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;



public class PaymentControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PaymentService paymentService;
        
    @Mock
    private CommisionRepository commisionRepository;

    @Mock
    private BaseUserService userService;

    @Mock
    private PaymentIntent paymentIntent;

    @InjectMocks
    private PaymentController paymentController;

    private PaymentDTO paymentDTO;

    private Client client;

    private Client client2;

    private Artist artist;

    private Commision commision;

    private BaseUser baseUser;

    private BaseUser baseUser2;

    private BaseUser baseUser3;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        baseUser = new BaseUser();
        baseUser.setId(1L);

        baseUser2 = new BaseUser();
        baseUser2.setId(2L);

        baseUser3 = new BaseUser();
        baseUser3.setId(2L);

        client = new Client();
        client.setId(1L);
        client.setBaseUser(baseUser);

        client2 = new Client();
        client2.setId(2L);
        client2.setBaseUser(baseUser3);

        artist = new Artist();
        artist.setId(1L);
        artist.setBaseUser(baseUser2);

        paymentIntent = new PaymentIntent();
        paymentIntent.setId("pi_123");

        commision = new Commision();

        commision.setClient(client);
        commision.setArtist(artist);
        commision.setPrice(30.0);
        commision.setDescription("Comisión de prueba");

        paymentDTO = new PaymentDTO();
        paymentDTO.setAmount(1000L);
        paymentDTO.setDescription("Test Payment");

        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(paymentController).build();
        objectMapper = new ObjectMapper();

        when(commisionRepository.findById(1L)).thenReturn(java.util.Optional.of(commision));
        when(userService.findCurrentUser()).thenReturn(baseUser);
        
    }

    @Test
    public void testCreatePaymentSuccess() throws Exception {
        when(paymentService.createPayment(any(PaymentDTO.class), eq(1L))).thenReturn("pi_123");
        mockMvc.perform(post("/api/v1/payment/create/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("pi_123"));

        verify(paymentService, times(1)).createPayment(any(PaymentDTO.class), eq(1L));
    }

    @Test
    public void testCreatePaymentCommissionNotFound() throws Exception {
        when(paymentService.createPayment(any(PaymentDTO.class), eq(1L)))
                .thenThrow(new ResourceNotFoundException("Comisión no encontrada"));

        mockMvc.perform(post("/api/v1/payment/create/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentDTO)))
                .andExpect(status().isNotFound());

        verify(paymentService, times(1)).createPayment(any(PaymentDTO.class), eq(1L));
    }

    @Test
    public void testCreatePaymentBadRequest() throws Exception {
        when(paymentService.createPayment(any(PaymentDTO.class), eq(1L)))
                .thenThrow(new BadRequestException("Bad request"));

        mockMvc.perform(post("/api/v1/payment/create/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentDTO)))
                .andExpect(status().isBadRequest());

        verify(paymentService, times(1)).createPayment(any(PaymentDTO.class), eq(1L));
    }

    @Test
    public void testCreateByAnotherClient() throws Exception {
        commision.setClient(client2);
        when(paymentService.createPayment(any(PaymentDTO.class), eq(1L)))
            .thenThrow(new AccessDeniedException("No tienes acceso a esta comisión"));

        mockMvc.perform(post("/api/v1/payment/create/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentDTO)))
                .andExpect(status().isForbidden());

        verify(paymentService, times(1)).createPayment(any(PaymentDTO.class), eq(1L));
    }

    @Test
    public void testCreatePaymentStripeException() throws Exception {
        ApiException stripeException = new ApiException("Stripe API is down", null, null, 500, null);

        when(paymentService.createPayment(any(PaymentDTO.class), eq(1L)))
                .thenThrow(stripeException);

            mockMvc.perform(post("/api/v1/payment/create/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentDTO)))
                .andExpect(status().isBadGateway())
                .andExpect(content().string("Stripe API is down"));

        verify(paymentService, times(1)).createPayment(any(PaymentDTO.class), eq(1L));
    }

    @Test
    public void testCreatePaymentWithException() throws Exception {
        when(paymentService.createPayment(any(PaymentDTO.class), eq(1L)))
                .thenThrow(new Exception("Error inesperado"));
        mockMvc.perform(post("/api/v1/payment/create/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentDTO)))
                .andExpect(status().isInternalServerError());

        verify(paymentService, times(1)).createPayment(any(PaymentDTO.class), eq(1L));  
    }
    @Test
public void testCreatePaymentAndUpdateCommissionStatus() throws Exception {
    // Simula la creación de un pago exitoso
    when(paymentService.createPayment(any(PaymentDTO.class), eq(1L))).thenReturn("pi_123");
    
    // Ejecuta la llamada al API para crear el pago
    mockMvc.perform(post("/api/v1/payment/create/1")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(paymentDTO)))
            .andExpect(status().isOk())
            .andExpect(content().string("pi_123"));
    
    // Verifica que el estado de la comisión haya sido actualizado
    verify(commisionRepository, times(1)).save(any(Commision.class));
}
@Test
public void testCreatePaymentWithInvalidAmount() throws Exception {
    // Modifica el DTO para tener un monto negativo
    paymentDTO.setAmount(-1000L); // monto inválido
    
    mockMvc.perform(post("/api/v1/payment/create/1")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(paymentDTO)))
            .andExpect(status().isBadRequest())  // Debería devolver un error de "Bad Request"
            .andExpect(content().string("Invalid payment amount"));

    verify(paymentService, times(0)).createPayment(any(PaymentDTO.class), eq(1L)); // No debe llamar a createPayment
}

}


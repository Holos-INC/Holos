package com.HolosINC.Holos.stripe;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.client.Client;
import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.CommisionRepository;
import com.HolosINC.Holos.exceptions.AccessDeniedException;
import com.HolosINC.Holos.exceptions.BadRequestException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;
import com.stripe.exception.ApiException;
import com.stripe.model.PaymentIntent;

import com.stripe.param.PaymentIntentCreateParams;

public class PaymentServiceTest {

    @Mock
    private CommisionRepository commisionRepository;

    @Mock
    private BaseUserService userService;

    @Mock
    private PaymentIntent paymentIntent;

    @InjectMocks
    private PaymentService paymentService;

    private Client client;

    private Client client2;

    private Artist artist;

    private Commision commision;

    private BaseUser baseUser;

    private BaseUser baseUser2;

    private BaseUser baseUser3;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        commision = new Commision();

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

        commision.setClient(client);
        commision.setArtist(artist);
        commision.setPrice(30.0);
        commision.setDescription("Comisión de prueba");
    }

    @Test
    public void testCreatePaymentSuccess() throws Exception {
        when(commisionRepository.findById(1L)).thenReturn(java.util.Optional.of(commision));
        when(userService.findCurrentUser()).thenReturn(baseUser);
        
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setAmount(1000L);
        paymentDTO.setDescription(commision.getDescription());
        
        PaymentIntent mockPaymentIntent = Mockito.mock(PaymentIntent.class);
        when(mockPaymentIntent.getClientSecret()).thenReturn("secret");
    
        try (MockedStatic<PaymentIntent> paymentIntentMock = mockStatic(PaymentIntent.class)) {
            paymentIntentMock
                .when(() -> PaymentIntent.create(Mockito.any(PaymentIntentCreateParams.class)))
                .thenReturn(mockPaymentIntent); // Devuelve el PaymentIntent simulado
            
            String clientSecret = paymentService.createPayment(paymentDTO, 1L);
    
            assertEquals("secret", clientSecret);
            verify(commisionRepository, times(1)).save(commision);    
        }
    }

    @Test
    public void testCreatePaymentWithExistingPaymentIntent() throws Exception {
        when(commisionRepository.findById(1L)).thenReturn(java.util.Optional.of(commision));
        when(userService.findCurrentUser()).thenReturn(baseUser);

        commision.setPaymentIntentId("existingIntentId");

        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setAmount(1000L);
        paymentDTO.setDescription(commision.getDescription());

        try {
            paymentService.createPayment(paymentDTO, 1L);
            fail("Se esperaba una IllegalStateException");
        } catch (BadRequestException e) {
            assertEquals("Esta comisión ya tiene un pago asociado", e.getMessage());
        }
    }

    @Test
    void testCreatePaymentWithNegativeAmount() {
        when(commisionRepository.findById(1L)).thenReturn(Optional.of(commision));
        when(userService.findCurrentUser()).thenReturn(baseUser);
    
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setAmount(-1000L);
        paymentDTO.setDescription(commision.getDescription());
    
        try (MockedStatic<PaymentIntent> paymentIntentMock = mockStatic(PaymentIntent.class)) {
            paymentIntentMock
                .when(() -> PaymentIntent.create(Mockito.any(PaymentIntentCreateParams.class)))
                .thenThrow(new IllegalArgumentException("La cantidad del pago no puede ser nulo o 0"));
    
            BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> paymentService.createPayment(paymentDTO, 1L)
            );
    
            assertEquals("La cantidad del pago no puede ser nulo o 0", exception.getMessage());
            paymentIntentMock.verify(() -> PaymentIntent.create(Mockito.any(PaymentIntentCreateParams.class)), times(0));
        }
    }
    
    @Test
    void testCreatePaymentWithNullPaymentDTO() {
        when(commisionRepository.findById(1L)).thenReturn(Optional.of(commision));
        when(userService.findCurrentUser()).thenReturn(baseUser);
    
        try (MockedStatic<PaymentIntent> paymentIntentMock = mockStatic(PaymentIntent.class)) {
            paymentIntentMock
                .when(() -> PaymentIntent.create(Mockito.any(PaymentIntentCreateParams.class)))
                .thenThrow(new IllegalArgumentException("La cantidad del pago no puede ser nulo o 0"));
    
            BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> paymentService.createPayment(null, 1L)
            );
    
            assertEquals("La cantidad del pago no puede ser nulo o 0", exception.getMessage());
            paymentIntentMock.verify(() -> PaymentIntent.create(Mockito.any(PaymentIntentCreateParams.class)), times(0));
        }
    }
    
    @Test
    void testCreatePaymentWithNullArtist() {
        when(commisionRepository.findById(1L)).thenReturn(Optional.of(commision));
        when(userService.findCurrentUser()).thenReturn(baseUser);
        commision.setArtist(null); // Establecer el artista como null
    
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setAmount(1000L);
        paymentDTO.setDescription(commision.getDescription());
    
        try (MockedStatic<PaymentIntent> paymentIntentMock = mockStatic(PaymentIntent.class)) {
            paymentIntentMock
                .when(() -> PaymentIntent.create(Mockito.any(PaymentIntentCreateParams.class)))
                .thenThrow(new ResourceNotFoundException(""));
    
            ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> paymentService.createPayment(paymentDTO, 1L)
            );
    
            assertEquals("Esta comisión no tiene un artista asociado", exception.getMessage());
            paymentIntentMock.verify(() -> PaymentIntent.create(Mockito.any(PaymentIntentCreateParams.class)), times(0));
        }
    }
    
    @Test
    void testCreatePaymentWithAccessDenied() {
        when(commisionRepository.findById(1L)).thenReturn(Optional.of(commision));
        when(userService.findCurrentUser()).thenReturn(baseUser);

        commision.setClient(client2); 
    
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setAmount(1000L);
        paymentDTO.setDescription(commision.getDescription());
    
        try (MockedStatic<PaymentIntent> paymentIntentMock = mockStatic(PaymentIntent.class)) {
            paymentIntentMock
                .when(() -> PaymentIntent.create(Mockito.any(PaymentIntentCreateParams.class)))
                .thenThrow(new AccessDeniedException("No puedes acceder a este recurso"));
    
            AccessDeniedException exception = assertThrows(
                AccessDeniedException.class,
                () -> paymentService.createPayment(paymentDTO, 1L)
            );
    
            assertEquals("No puedes acceder a este recurso", exception.getMessage());
            paymentIntentMock.verify(() -> PaymentIntent.create(Mockito.any(PaymentIntentCreateParams.class)), times(0));
        }
    }
    
    @Test
    void testCreatePaymentWithCommisionNotFound() {
        when(commisionRepository.findById(1L)).thenReturn(Optional.empty());
        when(userService.findCurrentUser()).thenReturn(baseUser);
    
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setAmount(1000L);
        paymentDTO.setDescription(commision.getDescription());
    
        try (MockedStatic<PaymentIntent> paymentIntentMock = mockStatic(PaymentIntent.class)) {
            paymentIntentMock
                .when(() -> PaymentIntent.create(Mockito.any(PaymentIntentCreateParams.class)))
                .thenThrow(new ResourceNotFoundException("Commison not found with id: 1"));
    
            ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> paymentService.createPayment(paymentDTO, 1L)
            );
    
            assertEquals("Commison not found with id: 1", exception.getMessage());
            paymentIntentMock.verify(() -> PaymentIntent.create(Mockito.any(PaymentIntentCreateParams.class)), times(0));
        }
    }
    
    @Test
    void testCreatePaymentWithStripeException() {
        when(commisionRepository.findById(1L)).thenReturn(Optional.of(commision));
        when(userService.findCurrentUser()).thenReturn(baseUser);
    
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setAmount(1000L);
        paymentDTO.setDescription(commision.getDescription());
    
        try (MockedStatic<PaymentIntent> paymentIntentMock = mockStatic(PaymentIntent.class)) {
            paymentIntentMock
                .when(() -> PaymentIntent.create(Mockito.any(PaymentIntentCreateParams.class)))
                .thenThrow(new ApiException("Stripe API is down", null, null, 500, null));
    
            RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> paymentService.createPayment(paymentDTO, 1L)
            );
    
            assertEquals("Error al procesar el pago: Stripe API is down", exception.getMessage());
            paymentIntentMock.verify(() -> PaymentIntent.create(Mockito.any(PaymentIntentCreateParams.class)));
        }
    }    
    @Test
void testCreatePaymentWithNullAmount() {
    when(commisionRepository.findById(1L)).thenReturn(Optional.of(commision));
    when(userService.findCurrentUser()).thenReturn(baseUser);

    PaymentDTO paymentDTO = new PaymentDTO();
    paymentDTO.setAmount(null); // Monto nulo
    paymentDTO.setDescription(commision.getDescription());

    try (MockedStatic<PaymentIntent> paymentIntentMock = mockStatic(PaymentIntent.class)) {
        paymentIntentMock
            .when(() -> PaymentIntent.create(Mockito.any(PaymentIntentCreateParams.class)))
            .thenThrow(new BadRequestException("La cantidad del pago no puede ser nula"));

        BadRequestException exception = assertThrows(
            BadRequestException.class,
            () -> paymentService.createPayment(paymentDTO, 1L)
        );

        assertEquals("La cantidad del pago no puede ser nula", exception.getMessage());
        paymentIntentMock.verify(() -> PaymentIntent.create(Mockito.any(PaymentIntentCreateParams.class)), times(0));
    }
}

@Test
void testCreatePaymentWithValidCommission() throws Exception {
    when(commisionRepository.findById(1L)).thenReturn(Optional.of(commision));
    when(userService.findCurrentUser()).thenReturn(baseUser);

    PaymentDTO paymentDTO = new PaymentDTO();
    paymentDTO.setAmount(1000L);  // Monto válido
    paymentDTO.setDescription(commision.getDescription());

    try (MockedStatic<PaymentIntent> paymentIntentMock = mockStatic(PaymentIntent.class)) {
        PaymentIntent mockPaymentIntent = mock(PaymentIntent.class);
        when(mockPaymentIntent.getClientSecret()).thenReturn("secret");

        paymentIntentMock
            .when(() -> PaymentIntent.create(Mockito.any(PaymentIntentCreateParams.class)))
            .thenReturn(mockPaymentIntent); // Simula el comportamiento exitoso de Stripe

        String clientSecret = paymentService.createPayment(paymentDTO, 1L);

        assertEquals("secret", clientSecret);  // Verifica que el cliente recibe el "client secret"
        verify(commisionRepository, times(1)).save(commision);  // Verifica que la comisión fue guardada
    }
}


}

package com.HolosINC.Holos.stripe;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistRepository;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.stripe.model.Customer;
import com.stripe.model.Subscription;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.SubscriptionCreateParams;

public class PremiumSubscriptionServiceTest {

    @Mock
    private BaseUserService userService;

    @Mock
    private ArtistRepository artistRepository;

    @InjectMocks
    private PremiumSubscriptionService premiumSubscriptionService;

    private BaseUser baseUser;
    private Artist artist;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        baseUser = new BaseUser();
        baseUser.setId(1L);
        baseUser.setEmail("user@example.com");

        artist = new Artist();
        artist.setId(1L);
        artist.setSubscriptionId(null);
    }

    @Test
    public void testCreateSubscriptionSuccess() throws Exception {
        when(userService.findCurrentUser()).thenReturn(baseUser);
        when(artistRepository.findArtistByUser(baseUser.getId())).thenReturn(java.util.Optional.of(artist));

        String paymentMethod = "pm_123";
        
        try (MockedStatic<Customer> customerMock = mockStatic(Customer.class)) {
            Customer mockCustomer = Mockito.mock(Customer.class);
            when(mockCustomer.getId()).thenReturn("cus_123");
            customerMock.when(() -> Customer.create(Mockito.any(CustomerCreateParams.class))).thenReturn(mockCustomer);

            Subscription mockSubscription = Mockito.mock(Subscription.class);
            when(mockSubscription.getId()).thenReturn("sub_123");

            try (MockedStatic<Subscription> subscriptionMock = mockStatic(Subscription.class)) {
                subscriptionMock.when(() -> Subscription.create(Mockito.any(SubscriptionCreateParams.class)))
                        .thenReturn(mockSubscription);

                String subscriptionId = premiumSubscriptionService.createSubscription(paymentMethod);
                
                assertEquals("sub_123", subscriptionId);
                verify(artistRepository, times(1)).save(artist);
            }
        }
    }

    @Test
    public void testCreateSubscriptionWithExistingSubscription() throws Exception {
        when(userService.findCurrentUser()).thenReturn(baseUser);
        artist.setSubscriptionId("sub_123");
        when(artistRepository.findArtistByUser(baseUser.getId())).thenReturn(java.util.Optional.of(artist));

        String paymentMethod = "pm_123";

        try {
            premiumSubscriptionService.createSubscription(paymentMethod);
            fail("Se esperaba una excepción indicando que el usuario ya tiene una suscripción activa");
        } catch (Exception e) {
            assertEquals("Este usuario ya tiene una suscripción activa", e.getMessage());
        }
    }

    @Test
    public void testCreateSubscriptionWithNoArtistFound() throws Exception {
        when(userService.findCurrentUser()).thenReturn(baseUser);
        when(artistRepository.findArtistByUser(baseUser.getId())).thenReturn(java.util.Optional.empty());

        String paymentMethod = "pm_123";

        try {
            premiumSubscriptionService.createSubscription(paymentMethod);
            fail("Se esperaba una ResourceNotFoundException");
        } catch (ResourceNotFoundException e) {
            assertEquals("Artist not found with userId: 1", e.getMessage());
        }
    }

    @Test
    public void testCancelSubscriptionSuccess() throws Exception {
        when(userService.findCurrentUser()).thenReturn(baseUser);
        artist.setSubscriptionId("sub_123");
        when(artistRepository.findArtistByUser(baseUser.getId())).thenReturn(java.util.Optional.of(artist));

        try (MockedStatic<Subscription> subscriptionMock = mockStatic(Subscription.class)) {
            Subscription mockSubscription = Mockito.mock(Subscription.class);
            when(mockSubscription.cancel()).thenReturn(mockSubscription);
            subscriptionMock.when(() -> Subscription.retrieve("sub_123")).thenReturn(mockSubscription);

            Subscription canceledSubscription = premiumSubscriptionService.cancelSubscription();
            
            assertEquals(mockSubscription, canceledSubscription);
        }
    }

    @Test
    public void testCancelSubscriptionWithNoActiveSubscription() {
        when(userService.findCurrentUser()).thenReturn(baseUser);
        artist.setSubscriptionId(null);
        when(artistRepository.findArtistByUser(baseUser.getId())).thenReturn(java.util.Optional.of(artist));

        try {
            premiumSubscriptionService.cancelSubscription();
            fail("Se esperaba una excepción indicando que el usuario no tiene una suscripción activa");
        } catch (Exception e) {
            assertEquals("Este usuario no es propietario de esta suscripción", e.getMessage());
        }
    }

    @Test
    public void testCancelSubscriptionWithNoArtistFound() throws Exception {
        when(userService.findCurrentUser()).thenReturn(baseUser);
        when(artistRepository.findArtistByUser(baseUser.getId())).thenReturn(java.util.Optional.empty());

        try {
            premiumSubscriptionService.cancelSubscription();
            fail("Se esperaba una ResourceNotFoundException");
        } catch (ResourceNotFoundException e) {
            assertEquals("Artist not found with userId: 1", e.getMessage());
        }
    }
}

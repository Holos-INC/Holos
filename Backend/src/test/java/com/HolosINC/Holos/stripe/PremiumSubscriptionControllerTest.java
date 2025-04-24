package com.HolosINC.Holos.stripe;

import com.HolosINC.Holos.exceptions.BadRequestException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.stripe.exception.ApiException;
import com.stripe.model.Subscription;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class PremiumSubscriptionControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PremiumSubscriptionService stripeService;

    @InjectMocks
    private PremiumSubscriptionController premiumSubscriptionController;

    private Subscription subscription;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(premiumSubscriptionController).build();

        subscription = new Subscription();
        subscription.setId("sub_123");
    }

    @Test
    public void testCreateSubscriptionSuccess() throws Exception {
        when(stripeService.createSubscription(any(String.class))).thenReturn("sub_123");

        mockMvc.perform(post("/api/v1/stripe-subsciption/create")
                .param("paymentMethod", "pm_123"))
                .andExpect(status().isOk())
                .andExpect(content().string("sub_123"));

        verify(stripeService, times(1)).createSubscription(any(String.class));
    }

    @Test
    public void testCreateSubscriptionNoSubscriptionFound() throws Exception {
        when(stripeService.createSubscription(any(String.class))).thenThrow(new ResourceNotFoundException("No subscription found"));

        mockMvc.perform(post("/api/v1/stripe-subsciption/create"))
                .andExpect(status().isBadRequest());

                verify(stripeService, times(0)).createSubscription(any(String.class));
    }

    @Test
    public void testCreateSuscriptionStripeException() throws Exception {
        ApiException stripeException = new ApiException("Stripe API is down", null, null, 500, null);

        when(stripeService.createSubscription(any(String.class))).thenThrow(stripeException);

        mockMvc.perform(post("/api/v1/stripe-subsciption/create"))
        .andExpect(status().isBadRequest());

        verify(stripeService, times(0)).createSubscription(any(String.class));
    }
    @Test
    public void testCreateSubscriptionBadRequest() throws Exception {
        when(stripeService.createSubscription(any(String.class))).thenThrow(new BadRequestException("Payment method is invalid"));

        mockMvc.perform(post("/api/v1/stripe-subsciption/create")
                .param("paymentMethod", ""))
                .andExpect(status().isBadRequest());

        verify(stripeService, times(1)).createSubscription(any(String.class));
    }

    @Test
    public void testCancelSubscriptionSuccess() throws Exception {
        when(stripeService.cancelSubscription()).thenReturn(subscription);

        mockMvc.perform(post("/api/v1/stripe-subsciption/delete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("sub_123"));

        verify(stripeService, times(1)).cancelSubscription();
    }
    
    @Test
    public void testCancelSubscriptionNoSubscriptionFound() throws Exception {
        when(stripeService.cancelSubscription()).thenThrow(new ResourceNotFoundException("No subscription found"));

        mockMvc.perform(post("/api/v1/stripe-subsciption/delete"))
                .andExpect(status().isNotFound());

        verify(stripeService, times(1)).cancelSubscription();
    }

    @Test
    public void testCancelSubscriptionBadRequest() throws Exception {
        when(stripeService.cancelSubscription()).thenThrow(new BadRequestException("Payment method is invalid"));

        mockMvc.perform(post("/api/v1/stripe-subsciption/delete"))
                .andExpect(status().isBadRequest());

                verify(stripeService, times(1)).cancelSubscription();
    }

    @Test
    public void testCancelSuscriptionStripeException() throws Exception {
        ApiException stripeException = new ApiException("Stripe API is down", null, null, 500, null);

        when(stripeService.cancelSubscription()).thenThrow(stripeException);

        mockMvc.perform(post("/api/v1/stripe-subsciption/delete"))
            .andExpect(status().isBadGateway());

            verify(stripeService, times(1)).cancelSubscription();
    }
    @Test
public void testCreateSubscriptionWithoutPaymentMethod() throws Exception {
    mockMvc.perform(post("/api/v1/stripe-subsciption/create"))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Payment method is required"));

    verify(stripeService, times(0)).createSubscription(any(String.class));
}


@Test
public void testCreateSubscriptionWithValidPaymentMethod() throws Exception {
    when(stripeService.createSubscription(any(String.class))).thenReturn("sub_123");

    mockMvc.perform(post("/api/v1/stripe-subsciption/create")
            .param("paymentMethod", "pm_123"))
            .andExpect(status().isOk())
            .andExpect(content().string("sub_123"));

    verify(stripeService, times(1)).createSubscription(any(String.class));
}

}


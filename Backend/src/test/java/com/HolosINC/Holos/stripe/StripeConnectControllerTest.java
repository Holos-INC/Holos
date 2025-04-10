package com.HolosINC.Holos.stripe;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistRepository;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;
import com.stripe.exception.ApiException;
import com.stripe.model.Account;
import com.stripe.model.AccountLink;
import com.stripe.param.AccountLinkCreateParams;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Optional;

public class StripeConnectControllerTest {

    private MockMvc mockMvc;

    @Mock
    private StripeConnectService stripeConnectService;

    @Mock
    private BaseUserService userService;

    @Mock
    private ArtistRepository artistRepository;

    @Mock
    private BaseUser baseUser;

    @Mock
    private AccountLink accountLink;

    @InjectMocks
    private StripeConnectController stripeConnectController;

    @BeforeEach
    void setUp() {
        baseUser = new BaseUser();
        baseUser.setId(1L);
        baseUser.setEmail("ejemplo@gmail.com");
    
        accountLink = new AccountLink();
        accountLink.setUrl("https://link_prueba.com");

        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(stripeConnectController).build();

    }

    @Test
    public void testCreateConnectedAccountWhenArtistDoesNotHaveAccount() throws Exception {
        Artist artist = new Artist();
        artist.setId(1L);
        artist.setBaseUser(baseUser);

        when(userService.findCurrentUser()).thenReturn(baseUser);
        when(artistRepository.findArtistByUser(1L)).thenReturn(Optional.of(artist));
        when(stripeConnectService.createConnectedAccount()).thenReturn("acct_123");

        assertNull(artist.getSellerAccountId());
        mockMvc.perform(post("/api/v1/stripe-account/create"))
                .andExpect(status().isOk())
                .andExpect(content().string("acct_123")); 

        verify(stripeConnectService, times(1)).createConnectedAccount();
    }

    @Test
    public void testCreateConnectedAccountWhenArtistAlreadyHasAccount() throws Exception {
        Artist artist = new Artist();
        artist.setId(1L);
        artist.setBaseUser(baseUser);

        when(userService.findCurrentUser()).thenReturn(baseUser);
        when(artistRepository.findArtistByUser(1L)).thenReturn(Optional.of(artist));

        artist.setSellerAccountId("acct_123");
        assertNotNull(artist.getSellerAccountId());

        when(stripeConnectService.createConnectedAccount()).thenReturn("acct_123");
        mockMvc.perform(post("/api/v1/stripe-account/create"))
                .andExpect(status().isOk())
                .andExpect(content().string("acct_123")); 

        verify(stripeConnectService, times(1)).createConnectedAccount();
    }

    

    @Test
    public void testCreateConnectedAccountResourceNotFound() throws Exception {
        when(stripeConnectService.createConnectedAccount())
                .thenThrow(new ResourceNotFoundException("Artist not found"));

        mockMvc.perform(post("/api/v1/stripe-account/create"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Artist not found"));

        verify(stripeConnectService, times(1)).createConnectedAccount();
    }

    @Test
    public void testCreateConnectedAccountStripeException() throws Exception {
        ApiException stripeException = new ApiException("Stripe API is down", null, null, 500, null);

        when(stripeConnectService.createConnectedAccount())
            .thenThrow(stripeException);

        mockMvc.perform(post("/api/v1/stripe-account/create"))
            .andExpect(status().isBadGateway())
            .andExpect(content().string("Stripe API is down"));
            
        verify(stripeConnectService, times(1)).createConnectedAccount();
    }

    @Test
    public void testCreateAccountLinkSuccess() throws Exception {
        Artist artist = new Artist();
        artist.setId(1L);
        artist.setBaseUser(baseUser);

        Account account = new Account();
        account.setId("acct_123");

        artist.setSellerAccountId(account.getId());

        when(userService.findCurrentUser()).thenReturn(baseUser);
        when(artistRepository.findArtistByUser(1L)).thenReturn(Optional.of(artist));
        
        assertNotNull(artist.getSellerAccountId());
        when(stripeConnectService.createAccountLink()).thenReturn("https://link_prueba.com");
        try (MockedStatic<AccountLink> mockedAccountLink = mockStatic(AccountLink.class)) {
            mockedAccountLink
                .when(() -> AccountLink.create(Mockito.any(AccountLinkCreateParams.class)))
                .thenReturn(accountLink);
    
                mockMvc.perform(post("/api/v1/stripe-account/create-link"))
                .andExpect(status().isOk())
                .andExpect(content().string("https://link_prueba.com"));

            verify(stripeConnectService, times(1)).createAccountLink();
        } 
    }

    @Test
    public void testCreateAccountLinkArtistNotFound() throws Exception {
        when(stripeConnectService.createAccountLink())
                .thenThrow(new ResourceNotFoundException("No artist found"));

        mockMvc.perform(post("/api/v1/stripe-account/create-link"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("No artist found"));
            
        verify(stripeConnectService, times(1)).createAccountLink();
    }

    @Test
    public void testCreateAccountLinkStripeFailure() throws Exception {
        ApiException stripeException = new ApiException("Stripe API is down", null, null, 500, null);

        when(stripeConnectService.createAccountLink())
                .thenThrow(stripeException);
    
        mockMvc.perform(post("/api/v1/stripe-account/create-link"))
                .andExpect(status().isBadGateway())
                .andExpect(content().string("Stripe API is down"));

        verify(stripeConnectService, times(1)).createAccountLink();
    }
}



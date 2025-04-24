package com.HolosINC.Holos.stripe;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.never;
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
import com.HolosINC.Holos.artist.ArtistRepository;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;
import com.stripe.exception.ApiException;
import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import com.stripe.model.AccountLink;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.AccountLinkCreateParams;

public class StripeConnectServiceTest {

    @Mock
    private BaseUserService userService;

    @Mock
    private ArtistRepository artistRepository;

    @Mock
    private BaseUser baseUser;

    @Mock
    private Artist artist;

    @Mock
    private Account account;
    @Mock
    private AccountLink accountLink;

    @InjectMocks
    private StripeConnectService stripeConnectService;


    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        baseUser = new BaseUser();
        baseUser.setId(1L);
        baseUser.setEmail("ejemplo@gmail.com");
        
        artist = new Artist();
        artist.setId(1L);

        account = new Account();
        account.setId("acct_123");

        accountLink = new AccountLink();
        accountLink.setUrl("https://link_prueba.com");

        artist.setBaseUser(baseUser);

    }

    @Test
    public void testCreateConnectedAccountWhenArtistDoesNotHaveAccount() throws StripeException, Exception {
        when(userService.findCurrentUser()).thenReturn(baseUser);
        
        when(artistRepository.findArtistByUser(1L)).thenReturn(Optional.of(artist));

        assertNull(artist.getSellerAccountId());

        try (MockedStatic<Account> mockedAccount = mockStatic(Account.class)){
        mockedAccount
            .when(() -> Account.create(Mockito.any(AccountCreateParams.class)))
            .thenReturn(account);
    
        String newAccountId = stripeConnectService.createConnectedAccount();
    
        assertEquals(account.getId(), newAccountId);
        assertEquals(newAccountId, artist.getSellerAccountId());
        verify(artistRepository).save(artist);
        }
    }

    @Test
    public void testCreateConnectedAccountWhenArtistAlreadyHasAccount() throws StripeException, Exception {
        when(userService.findCurrentUser()).thenReturn(baseUser);
        when(artistRepository.findArtistByUser(1L)).thenReturn(Optional.of(artist));

        artist.setSellerAccountId(account.getId());
        assertNotNull(artist.getSellerAccountId());

        try (MockedStatic<Account> mockedAccount = mockStatic(Account.class)){
        mockedAccount
            .when(() -> Account.create(Mockito.any(AccountCreateParams.class)))
            .thenReturn(account);
    
        String newAccountId = stripeConnectService.createConnectedAccount();
    
        assertEquals(account.getId(), newAccountId);
        assertEquals(newAccountId, artist.getSellerAccountId());
        verify(artistRepository, never()).save(artist);
        }
    }

    @Test
    void testCreateConnectedAccountArtistNotFound() {
        
        when(userService.findCurrentUser()).thenReturn(baseUser);
        when(artistRepository.findArtistByUser(1L)).thenReturn(Optional.empty());

        assertThrows( ResourceNotFoundException.class,
            () -> stripeConnectService.createConnectedAccount()
        );

        verify(artistRepository, times(1)).findArtistByUser(1L);
    }

    @Test
    void testCreateConnectedAccountStripeException() throws StripeException {
        when(userService.findCurrentUser()).thenReturn(baseUser);
        when(artistRepository.findArtistByUser(1L)).thenReturn(Optional.of(artist));

        try (MockedStatic<Account> mockedAccount = mockStatic(Account.class)) {
            mockedAccount.when(() -> Account.create(any(AccountCreateParams.class)))
                        .thenThrow(new ApiException("Stripe API is down", null, null, 500, null));

            StripeException exception = assertThrows(
                StripeException.class,
                () -> stripeConnectService.createConnectedAccount()
            );

            assertEquals("Stripe API is down", exception.getMessage());
            mockedAccount.verify(() -> Account.create(any(AccountCreateParams.class)));
        }
    }
 
    @Test
    public void testCreateAccountLinkWhenArtistDoesNotHaveAccount() throws StripeException {
        when(userService.findCurrentUser()).thenReturn(baseUser);
        when(artistRepository.findArtistByUser(1L)).thenReturn(Optional.of(artist));
        
        artist.setSellerAccountId(null);
        assertNull(artist.getSellerAccountId());

        assertThrows(ResourceNotFoundException.class, () -> {
            stripeConnectService.createAccountLink();
        });
    }

    @Test
    public void testCreateAccountLinkWhenArtistHasAccount() throws Exception {
        when(userService.findCurrentUser()).thenReturn(baseUser);
        when(artistRepository.findArtistByUser(1L)).thenReturn(Optional.of(artist));
        artist.setSellerAccountId(account.getId());
        assertNotNull(artist.getSellerAccountId());

        try (MockedStatic<AccountLink> mockedAccountLink = mockStatic(AccountLink.class)) {
            mockedAccountLink
                .when(() -> AccountLink.create(Mockito.any(AccountLinkCreateParams.class)))
                .thenReturn(accountLink);
    
            String newAccountLink = stripeConnectService.createAccountLink();
    
            assertEquals(accountLink.getUrl(), newAccountLink);
        }

    } 

    @Test
    void testCreateAccountLinkArtistNotFound() {
        when(userService.findCurrentUser()).thenReturn(baseUser);
        when(artistRepository.findArtistByUser(1L)).thenReturn(Optional.empty());

        assertThrows( ResourceNotFoundException.class,
            () -> stripeConnectService.createAccountLink()
        );

        verify(artistRepository, times(1)).findArtistByUser(1L);
    }

    @Test
    void testCreateAccountLinkStripeException() throws StripeException {
        when(userService.findCurrentUser()).thenReturn(baseUser);
        when(artistRepository.findArtistByUser(1L)).thenReturn(Optional.of(artist));
        artist.setSellerAccountId(account.getId()); 
    
        try (MockedStatic<AccountLink> mockedAccountLink = mockStatic(AccountLink.class)) {
            mockedAccountLink.when(() -> AccountLink.create(any(AccountLinkCreateParams.class)))
                    .thenThrow(new ApiException("Stripe API is down", null, null, 500, null));
            StripeException exception = assertThrows(
                StripeException.class,
                () -> stripeConnectService.createAccountLink()
            );
            assertEquals("Stripe API is down", exception.getMessage());
            mockedAccountLink.verify(() -> AccountLink.create(any(AccountLinkCreateParams.class)));
        }
    }

    @Test
void testCreateAccountLinkBaseUserNotFound() {
    when(userService.findCurrentUser()).thenReturn(null); // Simulamos que no se encuentra un BaseUser

    assertThrows(ResourceNotFoundException.class, () -> {
        stripeConnectService.createAccountLink();
    });

    verify(artistRepository, never()).findArtistByUser(anyLong()); // No se debe intentar buscar el artista si no hay usuario
}
@Test
void testCreateConnectedAccountWithInvalidParams() throws StripeException {
    when(userService.findCurrentUser()).thenReturn(baseUser);
    when(artistRepository.findArtistByUser(1L)).thenReturn(Optional.of(artist));

    assertNull(artist.getSellerAccountId());

    try (MockedStatic<Account> mockedAccount = mockStatic(Account.class)) {
        mockedAccount.when(() -> Account.create(Mockito.any(AccountCreateParams.class)))
                .thenThrow(new ApiException("Invalid parameters provided", null, null, 400, null));

        StripeException exception = assertThrows(
            StripeException.class,
            () -> stripeConnectService.createConnectedAccount()
        );

        assertEquals("Invalid parameters provided", exception.getMessage());
        mockedAccount.verify(() -> Account.create(Mockito.any(AccountCreateParams.class)));
    }
}
}


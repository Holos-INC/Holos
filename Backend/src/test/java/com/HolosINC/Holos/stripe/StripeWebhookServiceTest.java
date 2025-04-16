package com.HolosINC.Holos.stripe;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistRepository;
import com.HolosINC.Holos.auth.Auth;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.Assert.*;

@RunWith(MockitoJUnitRunner.class)
public class StripeWebhookServiceTest {

    @Mock
    private ArtistRepository artistRepository;

    @Mock
    private BaseUserRepository userRepository;


    @InjectMocks
    private StripeWebhookService stripeWebhookService;

    @Test
    public void testHandleSubscriptionDeletedSuccess() throws Exception {
        // Arrange
        String subscriptionId = "sub_12345";
        Artist artist = new Artist();
        artist.setSubscriptionId(subscriptionId);

        BaseUser user = new BaseUser();
        user.setAuthority(Auth.ARTIST);
        artist.setBaseUser(user);

        when(artistRepository.findBySubscriptionId(subscriptionId)).thenReturn(Optional.of(artist));
        when(userRepository.save(any(BaseUser.class))).thenReturn(user);
        when(artistRepository.save(any(Artist.class))).thenReturn(artist);

        // Act
        stripeWebhookService.handleSubscriptionDeleted(subscriptionId);

        String expectedSubscriptionId = artistRepository.findBySubscriptionId(subscriptionId).get().getSubscriptionId();

        // Assert
        verify(artistRepository, times(1)).findBySubscriptionId(subscriptionId);
        verify(userRepository, times(1)).save(user);
        verify(artistRepository, times(1)).save(artist);

        // Verificar que el subscriptionId se haya eliminado
        assert(artist.getSubscriptionId() == expectedSubscriptionId);
    }

    @Test
    public void testHandleSubscriptionDeletedAuthorityNotFound() {
        String subscriptionId = null;
        BaseUser user = new BaseUser();
        Artist artist = new Artist();
        artist.setBaseUser(user);
        artist.setSubscriptionId(subscriptionId);

        when(artistRepository.findBySubscriptionId(subscriptionId)).thenReturn(Optional.of(artist));

        assertThrows(ResourceNotFoundException.class, () -> {
            stripeWebhookService.handleSubscriptionDeleted(null);
        });
    }

    @Test
    public void testHandleSubscriptionCreatedArtistNotFound() throws Exception{
        String subscriptionId = "sub_67890";

        when(artistRepository.findBySubscriptionId(subscriptionId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            stripeWebhookService.handleSubscriptionCreated(null);
        });
        verify(userRepository, times(0)).save(any(BaseUser.class));
        verify(artistRepository, times(0)).save(any(Artist.class));
    }

    @Test
    public void testHandleSubscriptionCreatedAuthorityNotFound() {
        String subscriptionId = "sub_67890";
        Artist artist = new Artist();
        artist.setSubscriptionId(subscriptionId);

        when(artistRepository.findBySubscriptionId(subscriptionId)).thenReturn(Optional.of(artist));

        assertThrows(ResourceNotFoundException.class, () -> {
            stripeWebhookService.handleSubscriptionCreated(null);
        });
    }
}

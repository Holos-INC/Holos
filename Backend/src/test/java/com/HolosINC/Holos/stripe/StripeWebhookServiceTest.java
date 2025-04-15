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
    public void testHandleSubscriptionDeletedSuccess() {
        String subscriptionId = "sub_12345";
        Artist artist = new Artist();

        artist.setSubscriptionId(subscriptionId);

        BaseUser user = new BaseUser();

        user.setAuthority(Auth.ARTIST);
        artist.setBaseUser(user);
        artist.setSubscriptionId(subscriptionId);

        when(artistRepository.findBySubscriptionId(subscriptionId)).thenReturn(Optional.of(artist));
        when(userRepository.save(any(BaseUser.class))).thenReturn(user);
        when(artistRepository.save(any(Artist.class))).thenReturn(artist);

        stripeWebhookService.handleSubscriptionDeleted(subscriptionId);

        verify(userRepository, times(1)).save(user);
        verify(artistRepository, times(1)).save(artist);
        assertNull(artist.getSubscriptionId()); 
    }

    @Test(expected = ResourceNotFoundException.class)
    public void testHandleSubscriptionDeletedAuthorityNotFound() {
        String subscriptionId = "sub_12345";
        Artist artist = new Artist();
        artist.setSubscriptionId(subscriptionId);

        when(artistRepository.findBySubscriptionId(subscriptionId)).thenReturn(Optional.of(artist));

        stripeWebhookService.handleSubscriptionDeleted(subscriptionId);
    }

    @Test
    public void testHandleSubscriptionCreatedArtistNotFound() {
        String subscriptionId = "sub_67890";

        when(artistRepository.findBySubscriptionId(subscriptionId)).thenReturn(Optional.empty());

        stripeWebhookService.handleSubscriptionCreated(subscriptionId);

        verify(userRepository, times(0)).save(any(BaseUser.class));
        verify(artistRepository, times(0)).save(any(Artist.class));
    }

    @Test(expected = ResourceNotFoundException.class)
    public void testHandleSubscriptionCreatedAuthorityNotFound() {
        String subscriptionId = "sub_67890";
        Artist artist = new Artist();
        artist.setSubscriptionId(subscriptionId);

        when(artistRepository.findBySubscriptionId(subscriptionId)).thenReturn(Optional.of(artist));

        stripeWebhookService.handleSubscriptionCreated(subscriptionId);
    }
}

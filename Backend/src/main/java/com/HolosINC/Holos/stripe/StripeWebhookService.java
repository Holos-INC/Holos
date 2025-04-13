package com.HolosINC.Holos.stripe;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistRepository;
import com.HolosINC.Holos.auth.Auth;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class StripeWebhookService {

    private final ArtistRepository artistRepository;
    private final BaseUserRepository userRepository;

    public StripeWebhookService(ArtistRepository artistRepository, BaseUserRepository userRepository) {
        this.artistRepository = artistRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void handleSubscriptionDeleted(String subscriptionId) {
        Optional<Artist> artistOpt = artistRepository.findBySubscriptionId(subscriptionId);
        if (artistOpt.isEmpty()) {
            System.out.println("No se encontró el artista con el subscriptionId: " + subscriptionId);
            return;
        }
        Artist artist = artistOpt.get();     
        BaseUser user = artist.getBaseUser();
        
        user.setAuthority(Auth.ARTIST);
        userRepository.save(user);

        artist.setSubscriptionId(null);
        artistRepository.save(artist);
    }

    @Transactional
    public void handleSubscriptionCreated(String subscriptionId) {
        Optional<Artist> artistOpt = artistRepository.findBySubscriptionId(subscriptionId);
        artistOpt.ifPresent(artist -> {
            BaseUser user = artist.getBaseUser();
            user.setAuthority(Auth.ARTIST_PREMIUM);
            userRepository.save(user);
            artistRepository.save(artist);
        });
    }

}

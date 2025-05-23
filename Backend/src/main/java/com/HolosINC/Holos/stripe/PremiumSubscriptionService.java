package com.HolosINC.Holos.stripe;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistRepository;
import com.HolosINC.Holos.auth.Auth;
import com.HolosINC.Holos.exceptions.BadRequestException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.exceptions.ResourceNotOwnedException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;

import com.stripe.model.Subscription;

import com.stripe.param.CustomerCreateParams;
import com.stripe.param.SubscriptionCreateParams;



@Service
public class PremiumSubscriptionService {

    @Value("${stripe.key.secret}") 
    private String secretKey;

    @Value("${stripe.product.id}") 
    private String priceId;

    private final BaseUserService userService;
    private final ArtistRepository artistRepository;
    
    public PremiumSubscriptionService(BaseUserService userService, ArtistRepository artistRepository) {
        this.userService = userService;
        this.artistRepository = artistRepository;
    }  

    @Transactional
    public String createSubscription(String paymentMethod) throws StripeException {
        Stripe.apiKey = secretKey;
        BaseUser activeUser = userService.findCurrentUser();
        Artist artist = artistRepository.findArtistByUser(activeUser.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Artist", "userId", activeUser.getId()));

        if(artist.getSubscriptionId()!=null){
            throw new BadRequestException("Este usuario ya tiene una suscripción activa");
        }

        // Crear un cliente en Stripe (si aún no tienes uno)
        CustomerCreateParams customerParams = CustomerCreateParams.builder()
                .setEmail(activeUser.getEmail())
                .setPaymentMethod(paymentMethod)
                .setInvoiceSettings(CustomerCreateParams.InvoiceSettings.builder()
                    .setDefaultPaymentMethod(paymentMethod).build())
                .build();
        
        Customer customer = Customer.create(customerParams);

        // Crear la suscripción
        SubscriptionCreateParams subscriptionParams = SubscriptionCreateParams.builder()
                .setCustomer(customer.getId())
                .addItem(SubscriptionCreateParams.Item.builder()
                        .setPrice(priceId)
                        .build())
                .build();

        Subscription subscription = Subscription.create(subscriptionParams);
        artist.setSubscriptionId(subscription.getId());
        artist.getBaseUser().setAuthority(Auth.ARTIST_PREMIUM);
        artistRepository.save(artist);
        return subscription.getId();
    }

    @Transactional
    public Subscription cancelSubscription() throws StripeException {
        Stripe.apiKey = secretKey;
        BaseUser activeUser = userService.findCurrentUser();
        Artist artist = artistRepository.findArtistByUser(activeUser.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Artist", "userId", activeUser.getId()));
        String subscriptionId = artist.getSubscriptionId();
        if(subscriptionId==null){
            throw new BadRequestException("Este usuario no tiene una suscripción asociada");
        }
        
        if(!artist.getSubscriptionId().trim().equals(subscriptionId.trim())){
            throw new ResourceNotOwnedException("Este usuario no es propietario de esta suscripción");
        }

        Subscription subscription = Subscription.retrieve(subscriptionId);
        // Devuelve el artista a ser Artista
        artist.getBaseUser().setAuthority(Auth.ARTIST);
        artist.setSubscriptionId(null);
        return subscription.cancel();
    }

}
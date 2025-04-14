package com.HolosINC.Holos.stripe;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistRepository;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import com.stripe.model.AccountLink;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.AccountLinkCreateParams;


@Service
public class StripeConnectService {

    @Value("${stripe.key.secret}") 
    private String secretKey;
    private String returnUrl = "https://connect.stripe.com/app/express";
    private String refreshUrl = "http://localhost:8081"; //Esta página habría que cambiarla, aquí se reedirige al usuario si no ha podido generar el enlace correctamente

    private final BaseUserService userService;
    private final ArtistRepository artistRepository;
    

    @Autowired
    public StripeConnectService(BaseUserService userService, ArtistRepository artistRepository) {
        this.userService = userService;
        this.artistRepository = artistRepository;
    }  

    @Transactional
    public String createConnectedAccount() throws StripeException {
        Stripe.apiKey = secretKey;
        BaseUser activeUser = userService.findCurrentUser();
        Artist artist = artistRepository.findArtistByUser(activeUser.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Artist", "id", activeUser.getId()));


        if (artist.getSellerAccountId() != null) {
            return artist.getSellerAccountId();
        } 
        
        AccountCreateParams params = AccountCreateParams.builder()
                .setType(AccountCreateParams.Type.EXPRESS) 
                .setCountry("ES") 
                .setEmail(activeUser.getEmail())
                .build();

        Account account = Account.create(params);
        artist.setSellerAccountId(account.getId());
        artistRepository.save(artist); 

        return account.getId(); 
    }

    @Transactional
    public String createAccountLink() throws StripeException {  
        Long userId = userService.findCurrentUser().getId();
        Artist artist = artistRepository.findArtistByUser(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Artist", "id", userId));

        if (artist.getSellerAccountId() == null) {
            throw new ResourceNotFoundException("StripeAccount", "userId", userId);
        } 

        AccountLinkCreateParams params = AccountLinkCreateParams.builder()
            .setAccount(artist.getSellerAccountId())
            .setRefreshUrl(refreshUrl) // Redirigir en caso de error
            .setReturnUrl(returnUrl) // Redirigir tras completar
            .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
            .build();

    AccountLink accountLink = AccountLink.create(params);
    return accountLink.getUrl();
    }
}

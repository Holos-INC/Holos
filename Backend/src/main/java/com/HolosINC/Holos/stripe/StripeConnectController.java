package com.HolosINC.Holos.stripe;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.stripe.exception.StripeException;

@RestController
@RequestMapping("/api/v1/stripe-account")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Stripe Connect Controller", description = "API for managing Stripe Accounts")
public class StripeConnectController {

    private final StripeConnectService stripeConnectService;

    @Autowired
    public StripeConnectController(StripeConnectService stripeConnectService) {
        this.stripeConnectService = stripeConnectService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createConnectedAccount(){
        try{
            String accountId = stripeConnectService.createConnectedAccount();
        return new ResponseEntity<String>(accountId, HttpStatus.OK);
        } catch (StripeException e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
    }

    @GetMapping("/create-link")
    public ResponseEntity<String> createAccountLink() throws StripeException{
        try{
            String accountLinkUrl = stripeConnectService.createAccountLink();
            return new ResponseEntity<String>(accountLinkUrl, HttpStatus.OK);
        } catch (StripeException e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

}

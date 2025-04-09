package com.HolosINC.Holos.stripe;

import com.stripe.exception.StripeException;
import com.stripe.model.Account;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/all")
    public ResponseEntity<List<Account>> getAllConnectedAccounts() {
        try {
            List<Account> accounts = stripeConnectService.getAllConnectedAccounts();
            return new ResponseEntity<>(accounts, HttpStatus.OK);
        } catch (StripeException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<String> getAccountById(@PathVariable String accountId){
        try {
            Account account= stripeConnectService.getById(accountId);
            String accountStr = account.toJson();
            return new ResponseEntity<String>(accountStr, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<String> createConnectedAccount(){
        try {
            String accountId = stripeConnectService.createConnectedAccount();
            return new ResponseEntity<String>(accountId, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/create-link")
    public ResponseEntity<String> createAccountLink(){
        try {
            String accountLinkUrl = stripeConnectService.createAccountLink();
            return new ResponseEntity<String>(accountLinkUrl, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}

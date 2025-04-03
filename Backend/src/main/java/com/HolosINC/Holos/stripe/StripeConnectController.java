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
    public ResponseEntity<List<Account>> getAllConnectedAccounts() throws StripeException {
        List<Account> accounts = stripeConnectService.getAllConnectedAccounts();
        return new ResponseEntity<List<Account>>(accounts, HttpStatus.OK);
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<String> getAccountById(@PathVariable String accountId) throws StripeException{
        Account account= stripeConnectService.getById(accountId);
        String accountStr = account.toJson();
        return new ResponseEntity<String>(accountStr, HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<String> createConnectedAccount() throws StripeException{
        String accountId = stripeConnectService.createConnectedAccount();
        return new ResponseEntity<String>(accountId, HttpStatus.OK);
    }

    @GetMapping("/create-link")
    public ResponseEntity<String> createAccountLink() throws StripeException{
        //Esto no debería pedir un sellerAccountId ya que se obtendría con el findCurrentUser
        String accountLinkUrl = stripeConnectService.createAccountLink();
        return new ResponseEntity<String>(accountLinkUrl, HttpStatus.OK);
    }

}

package com.HolosINC.Holos.stripe;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

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

    public StripeConnectController(StripeConnectService stripeConnectService) {
        this.stripeConnectService = stripeConnectService;
    }

    @Operation(
        summary = "Create a connected Stripe account",
        description = "Creates a connected Stripe account for the user.",
        responses = {
            @ApiResponse(
                responseCode = "200", 
                description = "Connected Stripe account created successfully", 
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = String.class))
            ),
            @ApiResponse(
                responseCode = "400", 
                description = "Error creating connected Stripe account", 
                content = @Content(mediaType = "application/json")
            )
        }
    )
    @PostMapping("/create")
    public ResponseEntity<String> createConnectedAccount() {
        try {
            String accountId = stripeConnectService.createConnectedAccount();
            return new ResponseEntity<>(accountId, HttpStatus.OK);
        } catch (StripeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(
        summary = "Create an account link for Stripe",
        description = "Generates an account link for the user to complete their Stripe account setup.",
        responses = {
            @ApiResponse(
                responseCode = "200", 
                description = "Account link created successfully", 
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = String.class))
            ),
            @ApiResponse(
                responseCode = "400", 
                description = "Error creating account link", 
                content = @Content(mediaType = "application/json")
            )
        }
    )
    @GetMapping("/create-link")
    public ResponseEntity<String> createAccountLink() throws StripeException {
        try {
            String accountLinkUrl = stripeConnectService.createAccountLink();
            return new ResponseEntity<>(accountLinkUrl, HttpStatus.OK);
        } catch (StripeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}

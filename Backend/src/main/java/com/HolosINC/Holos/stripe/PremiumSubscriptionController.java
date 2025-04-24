package com.HolosINC.Holos.stripe;

import com.HolosINC.Holos.exceptions.BadRequestException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.exceptions.ResourceNotOwnedException;
import com.stripe.exception.StripeException;
import com.stripe.model.Subscription;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/stripe-subsciption")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Stripe Subscription Controller", description = "API for managing Stripe Subscriptions")
public class PremiumSubscriptionController {

    @Autowired
    private PremiumSubscriptionService stripeService;

    @PostMapping("/create")
    @Operation(summary = "Create a new Stripe subscription",
               description = "Creates a new subscription for a user with the provided payment method.")
    public ResponseEntity<String> createSubscription(@RequestParam String paymentMethod) throws Exception {
        try {
            String accountId = stripeService.createSubscription(paymentMethod);
            return new ResponseEntity<String>(accountId, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException(e.getMessage());
        } catch (BadRequestException e) {
            throw new BadRequestException(e.getMessage());
        } catch (StripeException e) { 
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_GATEWAY);
        }
    }

    @PostMapping("/delete")
    @Operation(summary = "Cancel an existing Stripe subscription",
               description = "Cancels the active Stripe subscription and returns the subscription details.")
    public ResponseEntity<String> cancelSubscription() throws Exception {
        try {
            Subscription subscription = stripeService.cancelSubscription();
            String subscriptionString = subscription.toJson();
            return new ResponseEntity<String>(subscriptionString, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException(e.getMessage());
        } catch (BadRequestException e) {
            throw new BadRequestException(e.getMessage());
        } catch (ResourceNotOwnedException e) {
            throw new ResourceNotOwnedException(e.getMessage());
        } catch (StripeException e) { 
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_GATEWAY);
        }
    }
}

package com.HolosINC.Holos.stripe;

import com.HolosINC.Holos.exceptions.AccessDeniedException;
import com.HolosINC.Holos.exceptions.BadRequestException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.stripe.exception.StripeException;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;


@RestController
@RequestMapping("/api/v1/payment")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Payment Controller", description = "API for managing Payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/setup-intent/{commissionId}")
    public ResponseEntity<?> createSetupIntent(@PathVariable long commissionId) {
        try {
            String clientSecret = paymentService.createSetupIntent(commissionId);
            return new ResponseEntity<>(clientSecret, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException("Comisión no encontrada: " + e.getMessage());
        } catch (AccessDeniedException e) {
            throw new AccessDeniedException(e.getMessage());
        } catch (BadRequestException e) {
            throw new BadRequestException(e.getMessage());
        } catch (StripeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_GATEWAY);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/payment/{commissionId}")
    public ResponseEntity<?> createPaymentFromSetupIntent(@PathVariable long commissionId) {
        try {
            String paymentIntentStatus = paymentService.createPaymentFromSetupIntent(commissionId);
            return new ResponseEntity<>(paymentIntentStatus, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException("Comisión o artista no encontrado: " + e.getMessage());
        } catch (AccessDeniedException e) {
            throw new AccessDeniedException(e.getMessage());
        } catch (BadRequestException e) {
            throw new BadRequestException(e.getMessage());
        } catch (StripeException e) { 
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_GATEWAY);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @PostMapping("/create/{commissionId}")
    public ResponseEntity<?> createPayment(@PathVariable long commissionId) throws Exception {
        try {
            String paymentIntent = paymentService.createPayment(commissionId);
            return new ResponseEntity<>(paymentIntent, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException("Comisión o artista no encontrado: " + e.getMessage());
        } catch (BadRequestException e) {
            throw new BadRequestException(e.getMessage());
        } catch (AccessDeniedException e) {
            throw new AccessDeniedException(e.getMessage());
        } catch (StripeException e) { 
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_GATEWAY);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
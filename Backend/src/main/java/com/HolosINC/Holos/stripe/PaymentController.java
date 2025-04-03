package com.HolosINC.Holos.stripe;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.PaymentIntentCollection;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/{paymentIntentId}")
    public ResponseEntity<String> getPaymentById(@PathVariable("paymentIntentId") String paymentIntentId) throws StripeException{
        PaymentIntent paymentIntent= PaymentIntent.retrieve(paymentIntentId);
        String paymentStr = paymentIntent.toJson();
        return new ResponseEntity<String>(paymentStr, HttpStatus.OK);
    }

    @GetMapping("/pending-payments/{artistId}/{clientId}")
    public ResponseEntity<String> getPendingPayments(@PathVariable("artistId") long artistId, @PathVariable("clientId") long clientId) throws StripeException{
        PaymentIntentCollection paymentIntents = paymentService.getPendingPayments(artistId, clientId);
        String paymentStr = paymentIntents.toJson();
        return new ResponseEntity<String>(paymentStr, HttpStatus.OK);
    }

    @PostMapping("/create/{commisionId}")
    public ResponseEntity<String> createPayment(@PathVariable("commisionId") long commisionId) throws StripeException {
        String paymentIntent = paymentService.createPayment(commisionId);
        return new ResponseEntity<String>(paymentIntent, HttpStatus.OK);
    }

    @PostMapping("/confirm")
    public ResponseEntity<String> confirmPayment(@RequestParam String paymentIntentId, @RequestParam String paymentMethod) throws StripeException {
        //PaymentIntent paymentIntent = paymentService.confirmPayment(paymentIntentId, paymentMethod);
        PaymentIntent paymentIntent = paymentService.capturePayment(paymentIntentId, 1, paymentMethod);
        String paymentStr = paymentIntent.toJson();
        return new ResponseEntity<String>(paymentStr, HttpStatus.OK);
    }

    @PostMapping("/cancel")
    public ResponseEntity<String> cancelPayment(@RequestParam String paymentIntentId) throws StripeException {
        PaymentIntent paymentIntent = paymentService.cancelPayment(paymentIntentId);
        String paymentStr = paymentIntent.toJson();
        return new ResponseEntity<String>(paymentStr, HttpStatus.OK);
    }

    @PostMapping("/capture")
    public ResponseEntity<String> capturePayment(@RequestParam String paymentIntentId, @RequestParam double retrievePercentaje, @RequestParam String paymentMethod) throws StripeException {
        PaymentIntent paymentIntent = paymentService.capturePayment(paymentIntentId, retrievePercentaje, paymentMethod);
        String paymentStr = paymentIntent.toJson();
        return new ResponseEntity<String>(paymentStr, HttpStatus.OK);
    }
}
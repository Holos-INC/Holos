package com.HolosINC.Holos.stripe;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.PaymentIntentCollection;

import org.springframework.web.bind.annotation.RequestBody;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.web.bind.annotation.PathVariable;
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
        PaymentIntent paymentIntent= paymentService.getById(paymentIntentId);
        String paymentStr = paymentIntent.toJson();
        return new ResponseEntity<String>(paymentStr, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<String> getAllPayments() throws StripeException{
        PaymentIntentCollection paymentIntents = paymentService.getAll();
        String paymentStr = paymentIntents.toJson();
        return new ResponseEntity<String>(paymentStr, HttpStatus.OK);
    }

    @PostMapping("/create/{commissionId}")
    public ResponseEntity<String> createPayment(@RequestBody PaymentDTO paymentDTO, @PathVariable long commissionId) throws StripeException {
        String paymentIntent = paymentService.createPayment(paymentDTO, commissionId);
        return new ResponseEntity<String>(paymentIntent, HttpStatus.OK);
    }

    @PostMapping("/confirm")
    public ResponseEntity<String> confirmPayment(@RequestParam String paymentIntentId, @RequestParam String paymentMethod) throws StripeException {
        PaymentIntent paymentIntent = paymentService.confirmPayment(paymentIntentId, paymentMethod);
        String paymentStr = paymentIntent.toJson();
        return new ResponseEntity<String>(paymentStr, HttpStatus.OK);
    }

    @PostMapping("/cancel")
    public ResponseEntity<String> cancelPayment(@RequestParam String paymentIntentId) throws StripeException {
        PaymentIntent paymentIntent = paymentService.cancelPayment(paymentIntentId);
        String paymentStr = paymentIntent.toJson();
        return new ResponseEntity<String>(paymentStr, HttpStatus.OK);
    }
}
package com.HolosINC.Holos.stripe;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.stripe.model.Event;
import com.stripe.net.Webhook;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/stripe-webhook")
public class StripeWebhookController {

    private final StripeWebhookService stripeWebhookService;
    private final ObjectMapper objectMapper;

    @Value("${stripe.webhook.secret}")
    private String stripeWebhookSecret;

    public StripeWebhookController(StripeWebhookService stripeWebhookService, ObjectMapper objectMapper) {
        this.stripeWebhookService = stripeWebhookService;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload,
                                                      @RequestHeader("Stripe-Signature") String signature) {
        try {
            Event event = Webhook.constructEvent(payload, signature, stripeWebhookSecret);
            
            JsonNode eventJson = objectMapper.readTree(payload);

            switch (event.getType()) {
                case "customer.subscription.deleted":
                    String deletedSubscriptionId = eventJson.get("data").get("object").get("id").asText();
                    stripeWebhookService.handleSubscriptionDeleted(deletedSubscriptionId);
                    break;
                 case "invoice.payment_failed":
                    String failedSubscriptionId = eventJson.get("data").get("object").get("id").asText();
                    stripeWebhookService.handleSubscriptionDeleted(failedSubscriptionId);
                    break; 

                case "customer.subscription.created":
                    String createdSubscriptionId = eventJson.get("data").get("object").get("id").asText();
                    stripeWebhookService.handleSubscriptionCreated(createdSubscriptionId);
                    break;

                default:
                    return ResponseEntity.ok("Evento no manejado");
            }

            return ResponseEntity.ok("Evento procesado con éxito");

        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Error procesando JSON");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error interno");
        }
    }
}
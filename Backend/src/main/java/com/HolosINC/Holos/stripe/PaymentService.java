package com.HolosINC.Holos.stripe;


import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistRepository;
import com.HolosINC.Holos.client.Client;
import com.HolosINC.Holos.client.ClientRepository;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.exceptions.ResourceNotOwnedException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.CustomerCollection;
import com.stripe.model.PaymentIntent;
import com.stripe.model.PaymentIntentCollection;
import com.stripe.param.PaymentIntentConfirmParams;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentIntentListParams;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;


@Service
public class PaymentService {

    @Value("${stripe.key.secret}") // Inyecta el valor de la variable de entorno
    private String secretKey;
    private String returnUrl = "http://localhost:8081";
    private Double commisionPercentage = 0.06;

    private BaseUserService userService;
    private ArtistRepository artistRepository;
    private ClientRepository clientRepository;
    private String currency = "eur";

    @Autowired
    public PaymentService(BaseUserService userService, ArtistRepository artistRepository, ClientRepository clientRepository) {
        this.userService = userService;
        this.artistRepository = artistRepository;
        this.clientRepository = clientRepository;
    }  


    @Transactional
    public PaymentIntent getById(String paymentIntentId) throws StripeException{
        Stripe.apiKey = secretKey;
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        return paymentIntent;
    }

    @Transactional
    public PaymentIntentCollection getPendingPayments(long artistId, long clientId) throws StripeException {
        Stripe.apiKey = secretKey;

        Artist artist = artistRepository.findById(artistId)
            .orElseThrow(() -> new ResourceNotFoundException("Artist", "id", artistId));
        Client client = clientRepository.findById(clientId)
            .orElseThrow(() -> new ResourceNotFoundException("Client", "id", clientId));

        // Parámetros para filtrar PaymentIntents
        
        PaymentIntentListParams params = PaymentIntentListParams.builder()
            .build();
        PaymentIntentCollection pendingPaymentsCollection = PaymentIntent.list(params);

        // Filtrar los PaymentIntent según sellerAccountId y customerAccountId
        List<PaymentIntent> pendingPayments = pendingPaymentsCollection.getData().stream()
            .filter(pi -> "requires_payment_method".equals(pi.getStatus())&& 
                        pi.getTransferData() != null &&
                        artist.getSellerAccountId().equals(pi.getTransferData().getDestination()) &&
                        client.getCustomerId().equals(pi.getCustomer()))
            .collect(Collectors.toList());
            
        PaymentIntentCollection pendingCollection = new PaymentIntentCollection();
        pendingCollection.setData(pendingPayments);

        return pendingCollection;
    }

    @Transactional
    public String createPayment(PaymentDTO paymentDTO, long artistId, String clientEmail) throws StripeException {
        Stripe.apiKey = secretKey;
        BaseUser activeUser = userService.findCurrentUser();
        Artist artist = artistRepository.findArtistByUser(activeUser.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Artist", "id", artistId));

        if (paymentDTO.getAmount() == null || paymentDTO.getAmount() <= 0) {
            throw new ResourceNotFoundException("Payment amount can't be empty or 0");
        }

        Customer customer = findOrCreateCustomer(clientEmail);
        
        long commissionAmount = Math.round(paymentDTO.getAmount() * commisionPercentage);

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(paymentDTO.getAmount()) 
            .setCurrency(currency)
            .setReceiptEmail(clientEmail)
            .setCustomer(customer.getId()) // Asociar al cliente
            .setApplicationFeeAmount(commissionAmount) //Comisión de nuestra aplicación
            .setTransferData(
                        PaymentIntentCreateParams.TransferData.builder()
                            .setDestination(artist.getSellerAccountId()) // Enviar dinero al vendedor
                            .build())
            .build();
        PaymentIntent paymentIntent = PaymentIntent.create(params);
        
        return paymentIntent.getClientSecret();
    }
    

    @Transactional
    public PaymentIntent confirmPayment(String paymentIntentId, String paymentMethod) throws StripeException {
        Stripe.apiKey = secretKey;
        BaseUser activeUser = userService.findCurrentUser();
        Client client = clientRepository.getClientByUser(activeUser.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Client", "id", activeUser.getId()));
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
    
         if (!paymentIntent.getCustomer().trim().equals(client.getCustomerId().trim())){
            throw new ResourceNotOwnedException("No tienes derechos para confirmar este pago");
        } 
        PaymentIntentConfirmParams params = PaymentIntentConfirmParams.builder()
                .setPaymentMethod(paymentMethod) 
                .setReturnUrl(returnUrl) 
                .build();
        return paymentIntent.confirm(params);
    }

    @Transactional
    public PaymentIntent cancelPayment(String paymentIntentId) throws StripeException {
        Stripe.apiKey = secretKey;
        BaseUser activeUser = userService.findCurrentUser();
        Client client = clientRepository.getClientByUser(activeUser.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Client", "id", activeUser.getId()));
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        if (!paymentIntent.getCustomer().trim().equals(client.getCustomerId().trim())){
            throw new ResourceNotOwnedException("No tienes derechos para confirmar este pago");
        } 
        return paymentIntent.cancel();
    }


    //Esta función habrá que cambiarla con el webhook de la tarifa premium, pero de momento la dejo así para probar cosas
    private Customer findOrCreateCustomer(String clientEmail) throws StripeException {
        Map<String, Object> searchParams = new HashMap<>();
        searchParams.put("email", clientEmail);
        CustomerCollection customers = Customer.list(searchParams);
        Client client = clientRepository.getClientByEmail(clientEmail)
            .orElseThrow(() -> new ResourceNotFoundException("Client", "email", clientEmail));

        if (!customers.getData().isEmpty()) {
            Customer customer = customers.getData().get(0);
            client.setCustomerId(customer.getId());
            return customer; // Reutilizar si ya existe
        }

        // Si no existe, creamos un nuevo cliente sin necesidad de cuenta en Stripe
        Map<String, Object> customerParams = new HashMap<>();
        customerParams.put("email", clientEmail);
        
        Customer customer = Customer.create(customerParams);
        client.setCustomerId(customer.getId());
        return customer;
    }

}

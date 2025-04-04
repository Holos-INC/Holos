package com.HolosINC.Holos.stripe;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistRepository;
import com.HolosINC.Holos.client.Client;
import com.HolosINC.Holos.client.ClientRepository;
import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.CommisionRepository;
import com.HolosINC.Holos.exceptions.AccessDeniedException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.exceptions.ResourceNotOwnedException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.PaymentIntentCollection;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.PaymentIntentCaptureParams;
import com.stripe.param.PaymentIntentConfirmParams;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentIntentListParams;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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
    private CommisionRepository commisionRepository;
    private String currency = "eur";

    @Autowired
    public PaymentService(BaseUserService userService, ArtistRepository artistRepository, ClientRepository clientRepository, CommisionRepository commisionRepository) {
        this.userService = userService;
        this.artistRepository = artistRepository;
        this.clientRepository = clientRepository;
        this.commisionRepository = commisionRepository;
    }  

    //Puede que este método no sirva, ya que al final una comisión solo puede tener un PaymentIntent
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
    public String createPayment(long commisionId) throws StripeException {
        Stripe.apiKey = secretKey;
        BaseUser activeUser = userService.findCurrentUser();
        Customer customer = null;
        Artist artist = artistRepository.findArtistByUser(activeUser.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Artist", "userId", activeUser.getId()));

        Commision commision = commisionRepository.findById(commisionId)
            .orElseThrow(() -> new ResourceNotFoundException("Commison", "id", commisionId));

        if (commision.getPrice() == null || commision.getPrice() <= 0) {
            throw new ResourceNotFoundException("La cantidad del pago no puede ser nulo o 0");
        }

        if (commision.getArtist()==null || !commision.getArtist().equals(artist)){
                throw new AccessDeniedException("No puedes acceder a este recurso");
        }
        
        if (commision.getPaymentIntentId()!=null){
            throw new ResourceNotOwnedException("Esta comisión ya tiene un pago asociado");
        }
        

        Client client = commision.getClient();
        if (client==null){
            throw new ResourceNotFoundException("Esta comisión no tiene un cliente asociado");
        }

        if (client.getCustomerId()==null){
            CustomerCreateParams customerParams = CustomerCreateParams.builder()
                .setEmail(client.getBaseUser().getEmail())
                .build();
            customer = Customer.create(customerParams);
            client.setCustomerId(customer.getId());
            clientRepository.save(client);
        }
        else {
            customer = Customer.retrieve(client.getCustomerId());
        }

        long totalAmount = Math.round(commision.getPrice() * 100); //Precio de la comisión
        long commissionAmount = Math.round(totalAmount * commisionPercentage); //Comisión que cobramos nosotros

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(totalAmount) 
            .setCurrency(currency)
            .setReceiptEmail(client.getBaseUser().getEmail())
            .setCustomer(customer.getId()) // Asociar al cliente
            .setCaptureMethod(PaymentIntentCreateParams.CaptureMethod.MANUAL)
            .setApplicationFeeAmount(commissionAmount) //Comisión de nuestra aplicación
            .setDescription(commision.getDescription())
            .setTransferData(
                        PaymentIntentCreateParams.TransferData.builder()
                            .setDestination(artist.getSellerAccountId()) // Enviar dinero al vendedor
                            .build())
            .build();
        PaymentIntent paymentIntent = PaymentIntent.create(params);
        commision.setPaymentIntentId(paymentIntent.getId());
        return paymentIntent.getClientSecret();
    }
    

    @Transactional
    private PaymentIntent confirmPayment(PaymentIntent paymentIntent, String paymentMethod) throws StripeException {
        PaymentIntentConfirmParams params = PaymentIntentConfirmParams.builder()
                .setPaymentMethod(paymentMethod) 
                .setReturnUrl(returnUrl) 
                .build();
        return paymentIntent.confirm(params);
    }

    //Método para que el artista cancele el pago 
    @Transactional
    public PaymentIntent cancelPayment(String paymentIntentId) throws StripeException {
        Stripe.apiKey = secretKey;
        BaseUser activeUser = userService.findCurrentUser();
        Artist artist = artistRepository.findArtistByUser(activeUser.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Artist", "userId", activeUser.getId()));
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        if (!paymentIntent.getTransferData().getDestination().trim().equals(artist.getSellerAccountId().trim())){
            throw new ResourceNotOwnedException("No tienes derechos para cancelar este pago");
        } 
        if ("succeeded".equals(paymentIntent.getStatus()) || "canceled".equals(paymentIntent.getStatus())) {
            throw new IllegalStateException("No se puede cancelar un pago ya completado o cancelado.");
        }
        return paymentIntent.cancel();
    }

    //Método para que el cliente cancele el pago y se divida el monto del dinero
    @Transactional
    public PaymentIntent capturePayment(String paymentIntentId, double retrievePercentaje, String paymentMethod) throws StripeException {
        Stripe.apiKey = secretKey;
        BaseUser activeUser = userService.findCurrentUser();
        Client client = clientRepository.getClientByUser(activeUser.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Client", "id", activeUser.getId()));
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
    
        if (!paymentIntent.getCustomer().trim().equals(client.getCustomerId().trim())){
            throw new ResourceNotOwnedException("No tienes derechos para capturar este pago");
        } 

        if ("succeeded".equals(paymentIntent.getStatus()) || "canceled".equals(paymentIntent.getStatus())) {
            throw new IllegalStateException("No se puede cancelar un pago ya completado o cancelado.");
        }

        paymentIntent = confirmPayment(paymentIntent, paymentMethod);

        if ("requires_capture".equals(paymentIntent.getStatus())) {
            Long originalAmount = paymentIntent.getAmount(); // Monto total
            Long penaltyAmount = (long) (originalAmount * retrievePercentaje);
            PaymentIntentCaptureParams captureParams = 
                PaymentIntentCaptureParams.builder()
                    .setAmountToCapture(penaltyAmount) // Solo capturamos la penalización
                    .build();

            paymentIntent.capture(captureParams);
        }
        return paymentIntent;
    }

}

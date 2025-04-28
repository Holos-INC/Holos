package com.HolosINC.Holos.stripe;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.client.Client;
import com.HolosINC.Holos.client.ClientRepository;
import com.HolosINC.Holos.commision.CommisionRepository;
import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.exceptions.AccessDeniedException;
import com.HolosINC.Holos.exceptions.BadRequestException;
import com.HolosINC.Holos.commision.StatusCommision;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.SetupIntent;
import com.stripe.net.RequestOptions;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.SetupIntentCreateParams;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDateTime;


@Service
public class PaymentService {

    @Value("${stripe.key.secret}") // Inyecta el valor de la variable de entorno
    private String secretKey;
    private Double commisionPercentage = 0.06;
    private CommisionRepository commisionRepository;
    private BaseUserService userService;
    private ClientRepository clientRepository;
    private String currency = "eur";
    private PaymentHistoryRepository phr;    

    @Autowired
    public PaymentService(CommisionRepository commisionRepository, BaseUserService userService, PaymentHistoryRepository paymentHistoryRepository, ClientRepository clientRepository) {
        this.commisionRepository = commisionRepository;
        this.userService = userService;
        this.phr = paymentHistoryRepository;
        this.clientRepository = clientRepository;
    }
    
    @Transactional
    public String createSetupIntent(long commisionId) throws StripeException {
        Stripe.apiKey = secretKey;
        try {

            Commision commision = commisionRepository.findById(commisionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Commision", "id", commisionId));

            BaseUser activeUser = userService.findCurrentUser();
            Client client = commision.getClient();

            if (client == null || !client.getBaseUser().equals(activeUser)) {
                throw new AccessDeniedException("No puedes acceder a este recurso");
            }

            if (client.getStripeCustomerId() == null || client.getStripeCustomerId().isEmpty()) {
                CustomerCreateParams params = CustomerCreateParams.builder()
                    .setName(activeUser.getUsername())
                    .setEmail(activeUser.getEmail())
                    .build();
                Customer stripeCustomer = Customer.create(params);

                client.setStripeCustomerId(stripeCustomer.getId());
                clientRepository.save(client);
            } 

            SetupIntentCreateParams params = SetupIntentCreateParams.builder()
                    .addPaymentMethodType("card") 
                    .setCustomer(client.getStripeCustomerId()) 
                    .setUsage(SetupIntentCreateParams.Usage.OFF_SESSION)
                    .build();

            SetupIntent setupIntent = SetupIntent.create(params);
            commision.setSetupIntentId(setupIntent.getId());
            commisionRepository.save(commision);
            return setupIntent.getClientSecret();

        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException(e.getMessage());
        } catch (AccessDeniedException e) {
            throw new AccessDeniedException(e.getMessage());
        } catch (BadRequestException e) {
            throw new BadRequestException(e.getMessage());
        } catch (StripeException e) {
            throw new RuntimeException("Error al procesar el SetupIntent con Stripe: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Error inesperado al crear el SetupIntent: " + e.getMessage(), e);
        }
    }
    
    public String createPaymentFromSetupIntent(long commisionId) throws StripeException {
        Stripe.apiKey = secretKey;
    
        try {

            Commision commision = commisionRepository.findById(commisionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Commision", "id", commisionId));
    
            BaseUser activeUser = userService.findCurrentUser();
            Client client = commision.getClient();
            Artist artist = commision.getArtist();
    
            if (commision.getPrice() == null || commision.getPrice() <= 0) {
                throw new BadRequestException("La cantidad del pago no puede ser nulo o 0");
            }

            if (commision.getClient()==null || !client.getBaseUser().equals(activeUser)){
                throw new AccessDeniedException("No puedes acceder a este recurso");
            }

            if (artist==null){
                throw new ResourceNotFoundException("Esta comisión no tiene un artista asociado");
            }

            if (commision.getTotalPayments()<=commision.getCurrentPayments()){
                throw new BadRequestException("Se han realizado todos los pagos de esta comisión");
            }

            if (commision.isWaitingPayment()==false){
                throw new BadRequestException("Esta comisión no espera un nuevo pago");
            }

            String setupIntentId = commision.getSetupIntentId();
    
            if (setupIntentId == null) {
                throw new BadRequestException("Esta comisión no tiene una Setup de pago guardada");
            }
            
            SetupIntent setupIntent = SetupIntent.retrieve(setupIntentId);
            setupIntent.setPaymentMethod("pm_card_visa");
            String paymentMethodId = setupIntent.getPaymentMethod();

            long totalAmount = Math.round((commision.getPrice() * 100)/commision.getTotalPayments());
            long commissionAmount = Math.round(totalAmount * commisionPercentage);    

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(totalAmount)
                    .setCurrency(currency)
                    .setCustomer(client.getStripeCustomerId())
                    .setReceiptEmail(activeUser.getEmail())
                    .setPaymentMethod(paymentMethodId)
                    .setOffSession(true) // Cobro sin intervención del cliente
                    .setConfirm(true)    
                    .setDescription("Pago número "+(commision.getCurrentPayments()+1)+" de " +commision.getTotalPayments()+" de la comisión: " +commision.getName())
                    .setApplicationFeeAmount(commissionAmount)
                    .setTransferData(PaymentIntentCreateParams.TransferData.builder()
                            .setDestination(artist.getSellerAccountId()) 
                            .build())
                    .build();
    

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            if (commision.getCurrentPayments()==null){
                commision.setCurrentPayments(1);
            }
            else{
                commision.setCurrentPayments(commision.getCurrentPayments()+1);               
            }
            commision.setWaitingPayment(false);
            commisionRepository.save(commision);

            return paymentIntent.getClientSecret(); 
    
        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException(e.getMessage());
        } catch (AccessDeniedException e) {
            throw new AccessDeniedException(e.getMessage());
        } catch (BadRequestException e) {
            throw new BadRequestException(e.getMessage());
        } catch (StripeException e) {
            throw new RuntimeException("Error al procesar el pago con Stripe: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Error inesperado al crear el pago: " + e.getMessage(), e);
        }
    }

    @Transactional
    public String createPayment(long commisionId) throws StripeException, Exception {
        Stripe.apiKey = secretKey;
        try {
            Commision commision = commisionRepository.findById(commisionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commison", "id", commisionId));

            Artist artist = commision.getArtist();
            Client client = commision.getClient();
            BaseUser activeUser = userService.findCurrentUser();
            String email = activeUser.getEmail();

            if (commision.getPrice() == null || commision.getPrice() <= 0) {
                throw new BadRequestException("La cantidad del pago no puede ser nulo o 0");
            }

            if (commision.getClient()==null || !client.getBaseUser().equals(activeUser)){
                throw new AccessDeniedException("No puedes acceder a este recurso");
            }

            if (artist==null){
                throw new ResourceNotFoundException("Esta comisión no tiene un artista asociado");
            }

            if (commision.getTotalPayments()<=commision.getCurrentPayments()){
                throw new BadRequestException("Se han realizado todos los pagos de esta comisión");
            }

            if (!(commision.isWaitingPayment())){
                throw new BadRequestException("Esta comisión no espera un nuevo pago");
            }
            
            long totalAmount = Math.round((commision.getPrice() * 100)/commision.getTotalPayments());
            long commissionAmount = Math.round(totalAmount * commisionPercentage);

/*             RequestOptions requestOptions = RequestOptions.builder()
                .setIdempotencyKey("some-unique-key-per-user-action")
                .build(); */

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(totalAmount) 
                .setCurrency(currency)
                .setReceiptEmail(email)
                .setDescription(commision.getDescription())
                .setCurrency(currency)
                .setReceiptEmail(activeUser.getEmail())
                .setApplicationFeeAmount(commissionAmount) // Comisión de nuestra aplicación
                .setTransferData(
                            PaymentIntentCreateParams.TransferData.builder()
                                .setDestination(artist.getSellerAccountId()) // Enviar dinero al vendedor
                                .build())
                .build();
            PaymentIntent paymentIntent = PaymentIntent.create(params);
            if (commision.getCurrentPayments()==null){
                commision.setCurrentPayments(1);
            }
            else{
                commision.setCurrentPayments(commision.getCurrentPayments()+1);
            }
            commision.setWaitingPayment(false);
            commisionRepository.save(commision);
            return paymentIntent.getClientSecret();

        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException(e.getMessage());
        } catch (BadRequestException e) {
            throw new BadRequestException(e.getMessage());
        } catch (AccessDeniedException e) {
            throw new AccessDeniedException(e.getMessage());
        } catch (StripeException e) { 
            throw new RuntimeException("Error al procesar el pago: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new Exception("Error inesperado al crear el pago: " + e.getMessage());
        }
    }


    @Transactional
    public void processPayment(Long commissionId, PaymentIntent paymentIntent) {
        Commision commision = commisionRepository.findById(commissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Comisión no encontrada con ID: " + commissionId));

        if (!commision.getStatus().equals(StatusCommision.NOT_PAID_YET)) {
            throw new IllegalStateException("La comisión no está en estado NOT_PAID_YET");
        }

        commision.setStatus(StatusCommision.ACCEPTED);
        commisionRepository.save(commision);

        PaymentHistory paymentHistory = new PaymentHistory();
        paymentHistory.setCommision(commision);
        paymentHistory.setAmount(paymentIntent.getAmount() / 100.0); // Stripe usa centavos
        paymentHistory.setPaymentDate(LocalDateTime.now());
        paymentHistory.setPaymentMethod(paymentIntent.getPaymentMethod());
        phr.save(paymentHistory);
    }

}

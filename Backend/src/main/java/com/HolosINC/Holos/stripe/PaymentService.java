package com.HolosINC.Holos.stripe;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.client.Client;
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
import com.stripe.model.PaymentIntent;
import com.stripe.model.PaymentIntentCollection;
import com.stripe.param.PaymentIntentConfirmParams;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentIntentListParams;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.repository.CrudRepository;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${stripe.key.secret}") // Inyecta el valor de la variable de entorno
    private String secretKey;
    private Double commisionPercentage = 0.06;
    private CommisionRepository commisionRepository;
    private BaseUserService userService;
    private String currency = "eur";
    private PaymentHistoryRepository phr;    

    @Autowired
    public PaymentService(CommisionRepository commisionRepository, BaseUserService userService, PaymentHistoryRepository paymentHistoryRepository) {
        this.commisionRepository = commisionRepository;
        this.userService = userService;
        this.phr = paymentHistoryRepository;
    }  

    @Transactional
    public PaymentIntent getById(String paymentIntentId) throws StripeException {
        Stripe.apiKey = secretKey;
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        return paymentIntent;
    }

    @Transactional
    public PaymentIntentCollection getAll() throws StripeException {
        Stripe.apiKey = secretKey;
        PaymentIntentListParams params = PaymentIntentListParams.builder()
            .build();
        return PaymentIntent.list(params);
    }

    @Transactional
    public String createPayment(PaymentDTO paymentDTO, long commisionId) throws StripeException, Exception {
        Stripe.apiKey = secretKey;
        try {
            Commision commision = commisionRepository.findById(commisionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commison", "id", commisionId));

            Artist artist = commision.getArtist();
            Client client = commision.getClient();
            BaseUser activeUser = userService.findCurrentUser();
            String email = activeUser.getEmail();

            if (paymentDTO == null ||paymentDTO.getAmount() == null || paymentDTO.getAmount() <= 0) {
                throw new BadRequestException("La cantidad del pago no puede ser nulo o 0");
            }

            if (commision.getClient()==null || !client.getBaseUser().equals(activeUser)){
                throw new AccessDeniedException("No puedes acceder a este recurso");
            }
        
            if (commision.getPaymentIntentId()!=null){
                throw new BadRequestException("Esta comisión ya tiene un pago asociado");
            }

            if (artist==null){
                throw new ResourceNotFoundException("Esta comisión no tiene un artista asociado");
            }
            
            long totalAmount = Math.round(commision.getPrice() * 100);
            long commissionAmount = Math.round(totalAmount * commisionPercentage);

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(paymentDTO.getAmount()) 
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
            commision.setPaymentIntentId(paymentIntent.getId());
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
    public PaymentIntent confirmPayment(String paymentIntentId, String paymentMethod) throws StripeException {
        Stripe.apiKey = secretKey;
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        PaymentIntentConfirmParams params = PaymentIntentConfirmParams.builder()
                .setPaymentMethod(paymentMethod)
                .build();
        return paymentIntent.confirm(params);
    }

    public Long getCommissionIdByPaymentIntent(String paymentIntentId) {
        return commisionRepository.findCommissionIdByPaymentIntentId(paymentIntentId);
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

    @Transactional
    public PaymentIntent cancelPayment(String paymentIntentId) throws StripeException {
        Stripe.apiKey = secretKey;
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        return paymentIntent.cancel();
    }
}

package com.HolosINC.Holos.stripe;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.commision.Commision;
import com.HolosINC.Holos.commision.CommisionRepository;
import com.HolosINC.Holos.commision.CommisionService;
import com.HolosINC.Holos.commision.StatusCommision;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;
import com.HolosINC.Holos.payment.PaymentHistory;
import com.HolosINC.Holos.payment.PaymentHistoryRepository;
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

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${stripe.key.secret}") // Inyecta el valor de la variable de entorno
    private String secretKey;
    private String returnUrl = "http://localhost:8081";
    private Double commisionPercentage = 0.06;
    private CommisionService commisionService;
    private BaseUserService userService;
    private String currency = "eur";

    @Autowired
    private CommisionRepository commisionRepository;

    @Autowired
    private PaymentHistoryRepository paymentHistoryRepository;

    @Autowired
    public PaymentService(CommisionService commisionService, BaseUserService userService) {
        this.commisionService = commisionService;
        this.userService = userService;
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
    public String createPayment(PaymentDTO paymentDTO, long commisionId) throws StripeException {
        Stripe.apiKey = secretKey;
        Commision commision = commisionService.getCommisionById(commisionId);
        BaseUser activeUser = userService.findCurrentUser();
        String email = activeUser.getEmail();
        
        if (commision == null) {
            throw new ResourceNotFoundException("Commision", "id", commisionId);
        }
        Artist artist = commision.getArtist();
        if (artist == null) {
            throw new ResourceNotFoundException("Artist not found");
        }

        if (paymentDTO.getAmount() == null || paymentDTO.getAmount() <= 0) {
            throw new ResourceNotFoundException("Payment amount can't be empty or 0");
        }
        
        long commissionAmount = Math.round(paymentDTO.getAmount() * commisionPercentage);

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(paymentDTO.getAmount()) 
            .setCurrency(currency)
            .setReceiptEmail(email)
            .setApplicationFeeAmount(commissionAmount) // Comisión de nuestra aplicación
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
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        PaymentIntentConfirmParams params = PaymentIntentConfirmParams.builder()
                .setPaymentMethod(paymentMethod) 
                .setReturnUrl(returnUrl) 
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
        paymentHistoryRepository.save(paymentHistory);
    }

    @Transactional
    public PaymentIntent cancelPayment(String paymentIntentId) throws StripeException {
        Stripe.apiKey = secretKey;
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        return paymentIntent.cancel();
    }
}

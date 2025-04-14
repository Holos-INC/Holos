package com.HolosINC.Holos.stripe;


import java.time.LocalDateTime;

import com.HolosINC.Holos.commision.Commision;
import com.stripe.model.Order.Payment.Settings.AutomaticPaymentMethods;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentHistory {
    @Id
	@SequenceGenerator(name = "entity_seq", sequenceName = "entity_sequence", initialValue = 500)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "entity_seq")
    protected Long id;
    
    @ManyToOne
    private Commision commision;
    private Double Amount;
    private LocalDateTime paymentDate;
    private String PaymentMethod;
   
}

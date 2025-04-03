package com.HolosINC.Holos.stripe;

import lombok.Data;

@Data
public class PaymentDTO {
    Long amount;
    String description;
}

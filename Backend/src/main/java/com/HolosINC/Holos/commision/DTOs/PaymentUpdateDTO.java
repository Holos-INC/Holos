package com.HolosINC.Holos.commision.DTOs;
import com.HolosINC.Holos.commision.EnumPaymentArrangement;

public class PaymentUpdateDTO {
    private EnumPaymentArrangement paymentArrangement;
    private Integer totalPayments;

    public EnumPaymentArrangement getPaymentArrangement() {
        return paymentArrangement;
    }

    public void setPaymentArrangement(EnumPaymentArrangement paymentArrangement) {
        this.paymentArrangement = paymentArrangement;
    }

    public Integer getTotalPayments() {
        return totalPayments;
    }

    public void setTotalPayments(Integer totalPayments) {
        this.totalPayments = totalPayments;
    }
}



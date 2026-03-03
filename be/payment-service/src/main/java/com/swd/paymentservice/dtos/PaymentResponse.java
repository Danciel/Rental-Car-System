package com.swd.paymentservice.dtos;

import com.swd.paymentservice.enums.PaymentMethod;
import com.swd.paymentservice.enums.PaymentStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PaymentResponse {
    private Long paymentId;
    private String bookingNo;
    private PaymentMethod method;
    private BigDecimal amount;
    private PaymentStatus status;

    // Online
    private String paymentUrl;

    // Cash
    private String instructions;
}
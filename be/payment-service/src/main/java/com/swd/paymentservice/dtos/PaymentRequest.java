package com.swd.paymentservice.dtos;

import com.swd.paymentservice.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequest {

    @NotBlank
    private String bookingNo;

    @NotNull
    private PaymentMethod method;

}
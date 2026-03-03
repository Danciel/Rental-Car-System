package com.swd.paymentservice.services;

import com.swd.paymentservice.enums.PaymentMethod;

public interface PaymentGateway {
    PaymentMethod method();
}

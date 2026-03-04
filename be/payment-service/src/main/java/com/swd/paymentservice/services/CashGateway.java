package com.swd.paymentservice.services;

import com.swd.paymentservice.entities.PaymentTransaction;

public interface CashGateway extends PaymentGateway {
    String instructions(PaymentTransaction tx);
    void confirmPaid(PaymentTransaction tx);
}

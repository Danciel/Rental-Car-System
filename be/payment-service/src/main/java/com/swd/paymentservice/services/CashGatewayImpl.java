package com.swd.paymentservice.services;

import com.swd.paymentservice.entities.PaymentTransaction;
import com.swd.paymentservice.enums.PaymentMethod;
import com.swd.paymentservice.enums.PaymentStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class CashGatewayImpl implements CashGateway {

    @Override
    public PaymentMethod method() {
        return PaymentMethod.CASH;
    }

    @Override
    public String instructions(PaymentTransaction tx) {
        return "Thanh toán tiền mặt khi nhận xe. Mã giao dịch: " + tx.getTxnRefCode();
    }

    @Override
    public void confirmPaid(PaymentTransaction tx) {
        tx.setStatus(PaymentStatus.SUCCESS);
        tx.setPayDate(LocalDateTime.now());
        tx.setGatewayResponseCode("CASH_CONFIRMED");
    }
}

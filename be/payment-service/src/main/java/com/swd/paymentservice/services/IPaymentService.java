package com.swd.paymentservice.services;


import com.swd.paymentservice.dtos.PaymentRequest;
import com.swd.paymentservice.dtos.PaymentResponse;
import com.swd.paymentservice.enums.PaymentMethod;

import java.util.Map;

public interface IPaymentService {
    PaymentResponse initPayment(PaymentRequest request, String clientIp);

    void handleCallback(PaymentMethod method, Map<String, String> params);

    void confirmCashPaid(Long paymentId);
}

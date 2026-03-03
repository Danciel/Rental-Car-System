package com.swd.paymentservice.services;

import com.swd.paymentservice.entities.CallbackResult;
import com.swd.paymentservice.entities.PaymentTransaction;

import java.util.Map;

public interface OnlineRedirectGateway extends PaymentGateway {
    String createPaymentUrl(PaymentTransaction tx, String clientIp);
    CallbackResult verifyAndParseCallback(Map<String, String> params);
}

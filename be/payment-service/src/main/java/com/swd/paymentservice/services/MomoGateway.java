package com.swd.paymentservice.services;

import com.swd.paymentservice.entities.CallbackResult;
import com.swd.paymentservice.entities.PaymentTransaction;
import com.swd.paymentservice.enums.PaymentMethod;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class MomoGateway implements OnlineRedirectGateway {

    @Override
    public PaymentMethod method() {
        return PaymentMethod.MOMO;
    }

    @Override
    public String createPaymentUrl(PaymentTransaction tx, String clientIp) {
        // TODO: call MoMo sandbox create-payment để lấy payUrl
        return "https://test-payment.momo.vn/pay?orderId=" + tx.getTxnRefCode();
    }

    @Override
    public CallbackResult verifyAndParseCallback(Map<String, String> params) {
        // TODO: verify signature MoMo
        CallbackResult r = new CallbackResult();
        r.setValidSignature(true); // demo
        r.setTxnRefCode(params.get("orderId"));
        r.setGatewayTxnId(params.get("transId"));
        r.setResponseCode(params.get("resultCode"));
        r.setSuccess("0".equals(r.getResponseCode()));
        return r;
    }
}
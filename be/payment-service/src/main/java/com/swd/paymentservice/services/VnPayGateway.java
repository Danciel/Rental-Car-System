package com.swd.paymentservice.services;

import com.swd.paymentservice.entities.CallbackResult;
import com.swd.paymentservice.entities.PaymentTransaction;
import com.swd.paymentservice.enums.PaymentMethod;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class VnPayGateway implements OnlineRedirectGateway {

    @Override
    public PaymentMethod method() {
        return PaymentMethod.VNPAY;
    }

    @Override
    public String createPaymentUrl(PaymentTransaction tx, String clientIp) {
        // TODO: build URL đúng spec VNPay (tmnCode, amount, orderInfo, returnUrl...)
        return "https://sandbox.vnpayment.vn/pay?txnRef=" + tx.getTxnRefCode();
    }

    @Override
    public CallbackResult verifyAndParseCallback(Map<String, String> params) {
        // TODO: verify vnp_SecureHash bằng HMAC SHA512
        CallbackResult r = new CallbackResult();
        r.setValidSignature(true); // demo
        r.setTxnRefCode(params.get("vnp_TxnRef"));
        r.setGatewayTxnId(params.get("vnp_TransactionNo"));
        r.setResponseCode(params.get("vnp_ResponseCode"));
        r.setSuccess("00".equals(r.getResponseCode()));
        return r;
    }
}

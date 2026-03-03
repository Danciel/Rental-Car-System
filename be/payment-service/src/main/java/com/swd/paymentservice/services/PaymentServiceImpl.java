package com.swd.paymentservice.services;

import com.swd.paymentservice.entities.CallbackResult;
import com.swd.paymentservice.dtos.PaymentRequest;
import com.swd.paymentservice.dtos.PaymentResponse;
import com.swd.paymentservice.entities.*;
import com.swd.paymentservice.enums.PaymentMethod;
import com.swd.paymentservice.enums.PaymentStatus;
import com.swd.paymentservice.repositories.PaymentTransactionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentServiceImpl implements IPaymentService {

    private final PaymentTransactionRepository repo;
    private final PaymentGatewayRegistry gatewayRegistry;

    public PaymentServiceImpl(PaymentTransactionRepository repo, PaymentGatewayRegistry gatewayRegistry) {
        this.repo = repo;
        this.gatewayRegistry = gatewayRegistry;
    }

    @Override
    @Transactional
    public PaymentResponse initPayment(PaymentRequest request, String clientIp) {
        // TODO (chuẩn): gọi booking-service lấy amount + userId theo bookingNo
        // Demo sinh viên: giả lập
        BigDecimal amount = BigDecimal.valueOf(1500000);
        Long userId = 1L;

        PaymentTransaction tx = new PaymentTransaction();
        tx.setBookingNo(request.getBookingNo());
        tx.setUserId(userId);
        tx.setAmount(amount);
        tx.setMethod(request.getMethod());
        tx.setStatus(PaymentStatus.PENDING);
        tx.setTxnRefCode(generateTxnRef(request.getBookingNo()));

        tx = repo.save(tx);

        PaymentResponse res = toResponse(tx);

        PaymentGateway gateway = gatewayRegistry.get(tx.getMethod());

        if (gateway instanceof OnlineRedirectGateway onlineGateway) {
            res.setPaymentUrl(onlineGateway.createPaymentUrl(tx, clientIp));
        } else if (gateway instanceof CashGateway cashGateway) {
            res.setInstructions(cashGateway.instructions(tx));
        }

        return res;
    }

    @Override
    @Transactional
    public void handleCallback(PaymentMethod method, Map<String, String> params) {
        PaymentGateway gateway = gatewayRegistry.get(method);

        if (!(gateway instanceof OnlineRedirectGateway onlineGateway)) {
            throw new IllegalArgumentException("Method " + method + " is not an online gateway");
        }

        CallbackResult result = onlineGateway.verifyAndParseCallback(params);
        if (!result.isValidSignature()) {
            throw new IllegalArgumentException("Invalid signature");
        }

        PaymentTransaction tx = repo.findByTxnRefCode(result.getTxnRefCode())
                .orElseThrow(() -> new EntityNotFoundException("Transaction not found: " + result.getTxnRefCode()));

        // Idempotent: xử lý callback nhiều lần không bị double-update
        if (tx.getStatus() == PaymentStatus.SUCCESS || tx.getStatus() == PaymentStatus.FAILED) return;

        tx.setGatewayTxnId(result.getGatewayTxnId());
        tx.setGatewayResponseCode(result.getResponseCode());

        if (result.isSuccess()) {
            tx.setStatus(PaymentStatus.SUCCESS);
            tx.setPayDate(LocalDateTime.now());
            // TODO: notify booking-service: booking paid
        } else {
            tx.setStatus(PaymentStatus.FAILED);
        }

        repo.save(tx);
    }

    @Override
    @Transactional
    public void confirmCashPaid(Long paymentId) {
        PaymentTransaction tx = repo.findById(paymentId)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found: " + paymentId));

        if (tx.getMethod() != PaymentMethod.CASH) {
            throw new IllegalArgumentException("This payment is not CASH");
        }

        if (tx.getStatus() == PaymentStatus.SUCCESS) return;

        PaymentGateway gateway = gatewayRegistry.get(PaymentMethod.CASH);
        CashGateway cashGateway = (CashGateway) gateway;

        cashGateway.confirmPaid(tx);
        repo.save(tx);
    }

    private String generateTxnRef(String bookingNo) {
        String shortId = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        return bookingNo + "-" + shortId;
    }

    private PaymentResponse toResponse(PaymentTransaction tx) {
        PaymentResponse res = new PaymentResponse();
        res.setPaymentId(tx.getId());
        res.setBookingNo(tx.getBookingNo());
        res.setMethod(tx.getMethod());
        res.setAmount(tx.getAmount());
        res.setStatus(tx.getStatus());
        return res;
    }
}
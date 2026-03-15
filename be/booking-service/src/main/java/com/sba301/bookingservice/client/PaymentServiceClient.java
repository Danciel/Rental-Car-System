package com.sba301.bookingservice.client;

import com.sba301.bookingservice.dto.TransactionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentServiceClient {

    private final RestTemplate restTemplate;

    @Value("${service.payment.url}")
    private String paymentServiceUrl;

    public void payToAdmin(TransactionRequest request) {
        try {
            // 1. Tạo request entity kèm body
            HttpEntity<TransactionRequest> entity = new HttpEntity<>(request);

            // 2. Gọi POST sang Payment Service
            ResponseEntity<Map> response = restTemplate.exchange(
                    paymentServiceUrl + "/api/payments/pay",
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            // 3. Kiểm tra kết quả
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Payment service returned error: " + response.getStatusCode());
            }

        } catch (Exception e) {
            // Quăng ngoại lệ để @Transactional thực hiện rollback Booking
            throw new RuntimeException("Giao dịch thanh toán thất bại: " + e.getMessage());
        }
    }
}

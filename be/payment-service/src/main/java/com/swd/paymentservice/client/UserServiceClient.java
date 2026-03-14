package com.swd.paymentservice.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceClient {

    private final RestTemplate restTemplate;

    @Value("${service.user.url}")
    private String userServiceUrl;

    /**
     * Lấy ID người dùng dựa trên Email (Dùng cho các logic liên quan đến Admin/Hệ thống)
     */
    public Long getAuthenticatedUserId(String email) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-User-Email", email);

            ResponseEntity<Map> response = restTemplate.exchange(
                    userServiceUrl + "/api/users/me",
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    Map.class
            );

            return extractIdFromResponse(response);
        } catch (Exception e) {
            log.error("Failed to get user ID for email {}: {}", email, e.getMessage());
            return null;
        }
    }

    /**
     * Lấy thông tin Profile chi tiết qua ID (Dùng để lấy walletBalance, fullName...)
     */
    public Map<String, Object> getUserProfile(Long userId) {
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(
                    userServiceUrl + "/api/users/" + userId,
                    Map.class
            );

            if (response.getBody() != null && response.getBody().get("data") != null) {
                return (Map<String, Object>) response.getBody().get("data");
            }
            return null;
        } catch (Exception e) {
            log.error("Error fetching profile for user ID {}: {}", userId, e.getMessage());
            return null;
        }
    }

    /**
     * Cập nhật số dư ví của User.
     * @param amount: Giá trị dương để cộng tiền (Deposit), giá trị âm để trừ tiền (Withdraw/Payment)
     * @return Map chứa thông tin User sau khi cập nhật (để lấy postBalance)
     */
    public Map<String, Object> updateWallet(Long userId, BigDecimal amount) {
        try {
            // URL ví dụ: http://localhost:8081/api/users/1/wallet?amount=50000
            String url = userServiceUrl + "/api/users/" + userId + "/wallet?amount=" + amount;

            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.PUT,
                    null,
                    Map.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                log.info("Successfully updated wallet for user {}. Amount: {}", userId, amount);
                return (Map<String, Object>) response.getBody().get("data");
            } else {
                throw new RuntimeException("User Service returned error: " + response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("Failed to update wallet for user {}: {}", userId, e.getMessage());
            throw new RuntimeException("Giao dịch thất bại: Lỗi kết nối dịch vụ tài khoản.");
        }
    }

    /**
     * Lấy trạng thái User (Active, Inactive, v.v.)
     */
    public String getUserStatus(String email) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-User-Email", email);

            ResponseEntity<Map> response = restTemplate.exchange(
                    userServiceUrl + "/api/users/me",
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    Map.class
            );

            Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
            return (data != null && data.get("status") != null) ? data.get("status").toString() : null;
        } catch (Exception e) {
            log.warn("Failed to get user status for email {}: {}", email, e.getMessage());
            return null;
        }
    }

    private Long extractIdFromResponse(ResponseEntity<Map> response) {
        if (response.getBody() == null) return null;
        Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
        if (data == null || data.get("id") == null) return null;
        return Long.valueOf(data.get("id").toString());
    }
}
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
            headers.set("X-User-Roles", "ROLE_CUSTOMER");

            ResponseEntity<Map> response = restTemplate.exchange(
                    userServiceUrl + "/api/users/me",
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    Map.class
            );

            if (response.getBody() == null) return null;

            Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
            if (data == null) return null;

            Object id = data.get("id");
            return id != null ? Long.valueOf(id.toString()) : null;

        } catch (Exception e) {
            log.warn("Failed to get user profile for email {}: {}", email, e.getMessage());
            return null;
        }
    }

    /**
     * Lấy thông tin Profile chi tiết qua ID (Dùng để lấy walletBalance, fullName...)
     */
    public Map<String, Object> getUserProfile(Long userId) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-User-Email", "admin@gmail.com");
            headers.set("X-User-Roles", "ROLE_ADMIN");

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    userServiceUrl + "/api/users/" + userId,
                    HttpMethod.GET,
                    entity,
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
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-User-Email", "admin@gmail.com");
            headers.set("X-User-Roles", "ROLE_ADMIN");

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    userServiceUrl + "/api/users/" + userId + "/wallet?amount=" + amount,
                    HttpMethod.PUT,
                    entity,
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
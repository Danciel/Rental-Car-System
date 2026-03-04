// car-service/client/UserServiceClient.java
package com.swd.rentalcar.client;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserServiceClient {

    private final RestTemplate restTemplate;

    @Value("http://localhost:8081")
    private String userServiceUrl;

    // Cache the token after login so existsById can reuse it
    private String cachedToken = null;


    public boolean existsById(Long id) {
        try {
            HttpHeaders headers = new HttpHeaders();
            if (cachedToken != null) {
                headers.setBearerAuth(cachedToken);
            }

            HttpEntity<Void> entity = new HttpEntity<>(headers);
            Map<String, Object> response = restTemplate.getForObject(
                    userServiceUrl + "/api/users/{id}",
                    Map.class,
                    id
            );

            if (response == null) return false;

            // Unwrap "data" → check user exists
            Map<String, Object> data = (Map<String, Object>) response.get("data");
            return data != null && data.get("id") != null;

        } catch (Exception e) {
            throw new EntityNotFoundException("Không tìm thấy chủ xe với mã: " + id);
        }
    }

    public Long getOwnerIdByLogin(String email, String password) {
        try {
            Map<String, String> loginRequest = Map.of(
                    "email", email,
                    "password", password
            );

            Map<String, Object> response = restTemplate.postForObject(
                    userServiceUrl + "/api/users/login",
                    loginRequest,
                    Map.class
            );

            if (response == null) return null;

            // Unwrap "data" first
            Map<String, Object> data = (Map<String, Object>) response.get("data");
            if (data == null) return null;

            // Then get "user" → "id"
            Map<String, Object> user = (Map<String, Object>) data.get("user");
            if (user == null) return null;

            // Cache the token for subsequent calls
            cachedToken = (String) data.get("accessToken");

            Object id = user.get("id");
            return id != null ? Long.valueOf(id.toString()) : null;

        } catch (Exception e) {
            log.warn("Could not login as owner: {}"+ e.getMessage());
            return null;
        }
    }
}
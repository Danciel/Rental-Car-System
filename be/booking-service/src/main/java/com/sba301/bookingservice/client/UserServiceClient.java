package com.sba301.bookingservice.client;


import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;


@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceClient {

    private final RestTemplate restTemplate;

    @Value("${service.user.url}")
    private String userServiceUrl;

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
}
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
public class CarServiceClient {

    private final RestTemplate restTemplate;

    @Value("${service.car.url}")
    private String carServiceUrl;

    public boolean isCarAvailable(Long carId) {
        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    carServiceUrl + "/api/cars/{id}",
                    HttpMethod.GET,
                    null,
                    Map.class,
                    carId
            );

            log.info("Car service response for carId {}: {}", carId, response.getBody());

            if (response.getBody() == null) return false;

            Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
            String status = (String) data.get("status");
            return "AVAILABLE".equals(status);

        } catch (Exception e) {
            log.warn("Failed to check car availability for carId {}: {}", carId, e.getMessage());
            return false;
        }
    }

    public void updateCarStatus(Long carId, String status, String email) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-User-Email", email);

            restTemplate.exchange(
                    carServiceUrl + "/api/cars/{id}/status?status=" + status,
                    HttpMethod.PATCH,
                    new HttpEntity<>(headers),
                    Void.class,
                    carId
            );

            log.info("Updated car {} status to {}", carId, status);
        } catch (Exception e) {
            log.error("Failed to update car {} status to {}: {}", carId, status, e.getMessage());
            throw new RuntimeException("Không thể cập nhật trạng thái xe: " + e.getMessage());
        }
    }
}
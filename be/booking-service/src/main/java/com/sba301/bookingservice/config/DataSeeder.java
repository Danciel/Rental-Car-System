package com.sba301.bookingservice.config;

import com.sba301.bookingservice.entities.Booking;
import com.sba301.bookingservice.entities.BookingStatus;
import com.sba301.bookingservice.repositories.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@Configuration
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

  private final BookingRepository bookingRepository;
  private final RestTemplate restTemplate;

  @Value("${service.user.url}")
  private String userServiceUrl;

  @Value("${service.booking.url:http://localhost:8083}")
  private String bookingServiceUrl;

  // ═════════════════════════════════════════════════════════════════════
  // ENTRY POINT
  // ═════════════════════════════════════════════════════════════════════

  @Override
  public void run(String... args) {
    if (bookingRepository.count() > 0) {
      log.info("Skipping booking data seeding because data already exists");
      return;
    }

    log.info("🌱 Seeding initial booking history data...");

    LocalDateTime now = LocalDateTime.now();
    // Giả định User 1 (Customer1) vừa đặt, xe ID tương ứng với DB của Car-Service
    Long customerId = 1L;

    List<Booking> mockBookings = List.of(
            // 1. Chuyến đi ĐÃ HOÀN THÀNH
            Booking.builder()
                    .bookingCode("BKG-PAST-001")
                    .userId(customerId)
                    .carId(1L) // Dùng ID xe thực tế trong CarService
                    .startTime(now.minusDays(30))
                    .endTime(now.minusDays(28))
                    .status(BookingStatus.COMPLETED)
                    .totalPrice(BigDecimal.valueOf(1_400_000))
                    .depositAmount(BigDecimal.valueOf(500_000))
                    .createdAt(now.minusDays(35))
                    .build(),

            // 2. Chuyến đi BỊ HỦY
            Booking.builder()
                    .bookingCode("BKG-CANCEL-002")
                    .userId(customerId)
                    .carId(2L)
                    .startTime(now.minusDays(15))
                    .endTime(now.minusDays(12))
                    .status(BookingStatus.CANCELLED)
                    .totalPrice(BigDecimal.valueOf(1_800_000))
                    .depositAmount(BigDecimal.valueOf(500_000))
                    .createdAt(now.minusDays(20))
                    .build(),

            // 3. Chuyến đi ĐÃ XÁC NHẬN
            Booking.builder()
                    .bookingCode("BKG-CONFIRM-003")
                    .userId(customerId)
                    .carId(3L)
                    .startTime(now.plusDays(5))
                    .endTime(now.plusDays(8))
                    .status(BookingStatus.CONFIRMED)
                    .totalPrice(BigDecimal.valueOf(1_500_000))
                    .depositAmount(BigDecimal.valueOf(500_000))
                    .createdAt(now.minusDays(1))
                    .build(),


            // 4. Chuyến đi ĐANG CHỜ THANH TOÁN
            Booking.builder()
                    .bookingCode("BKG-PENDING-004")
                    .userId(customerId)
                    .carId(4L)
                    .startTime(now.plusDays(2))
                    .endTime(now.plusDays(4))
                    .status(BookingStatus.PENDING_PAYMENT)
                    .totalPrice(BigDecimal.valueOf(1_200_000))
                    .depositAmount(BigDecimal.valueOf(400_000))
                    .createdAt(now.minusHours(2)) // Vừa đặt cách đây 2 tiếng
                    .build()
    );
    String renterToken = login("customer1@gmail.com", "123456");
    if (renterToken == null) {
      log.warn("⚠️ Could not login as renter — skipping booking seed");
      return;
    }

    seedBookings(renterToken);
  }

  // ═════════════════════════════════════════════════════════════════════
  // LOGIN — UserServiceClient has no login method so we call REST directly
  // ═════════════════════════════════════════════════════════════════════

  private String login(String email, String password) {
    try {
      Map<String, String> body = Map.of("email", email, "password", password);
      Map<String, Object> response = restTemplate.postForObject(
              userServiceUrl + "/api/users/login", body, Map.class);
      if (response == null) return null;
      Map<String, Object> data = (Map<String, Object>) response.get("data");
      if (data == null) return null;
      String token = (String) data.get("accessToken");
      log.info("✅ Logged in as {} for seeding", email);
      return token;
    } catch (Exception e) {
      log.error("❌ Login failed for {}: {}", email, e.getMessage());
      return null;
    }
  }

  // ═════════════════════════════════════════════════════════════════════
  // SEED BOOKINGS
  // ═════════════════════════════════════════════════════════════════════

  private void seedBookings(String renterToken) {
    // Only AVAILABLE cars from the car-service seeder:
    // Skipped: 5 (STOPPED), 13 (BANNED), 19 (STOPPED)
    // { carId, startDaysFromNow, endDaysFromNow, rentalPrice }
    List<Object[]> entries = List.of(
            new Object[]{ 1L,  3,  5, "1600000"},
            new Object[]{ 2L,  5,  7, "1600000"},
            new Object[]{ 3L,  7, 10, "1400000"},
            new Object[]{ 4L,  4,  6, "1900000"},
            new Object[]{ 6L,  2,  4, "2100000"},
            new Object[]{ 7L,  6,  8, "2100000"},
            new Object[]{ 8L,  9, 12, "1700000"},
            new Object[]{ 9L,  5,  7, "1160000"},
            new Object[]{10L,  3,  5, "1160000"}
//            new Object[]{11L,  8, 11, "1440000"},
//            new Object[]{12L,  4,  6, "1700000"},
//            new Object[]{14L,  7, 10, "1160000"},
//            new Object[]{15L, 10, 13, "1440000"},
//            new Object[]{16L,  5,  8, "2200000"},
//            new Object[]{17L,  6,  9, "1800000"},
//            new Object[]{18L,  3,  5, "1800000"},
//            new Object[]{20L,  7, 10, "2400000"},
//            new Object[]{21L, 12, 15, "2100000"},
//            new Object[]{22L,  4,  7, "1560000"},
//            new Object[]{23L,  8, 11, "2600000"}
    );

    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + renterToken);
    headers.set("Content-Type", "application/json");
    headers.set("X-User-Email", "customer1@gmail.com");
    headers.set("X-User-Roles", "ROLE_CUSTOMER");

    int success = 0;
    for (Object[] entry : entries) {
      try {
        Long   carId     = (Long)   entry[0];
        int    startDays = (int)    entry[1];
        int    endDays   = (int)    entry[2];
        String price     = (String) entry[3];

        LocalDateTime start = LocalDateTime.now()
                .plusDays(startDays).withHour(10).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime end   = LocalDateTime.now()
                .plusDays(endDays).withHour(10).withMinute(0).withSecond(0).withNano(0);

        Map<String, Object> body = Map.of(
                "carId",         carId,
                "startTime",     start.toString(),
                "endTime",       end.toString(),
                "rentalPrice",   new BigDecimal(price),
                "depositAmount", new BigDecimal(price)
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        restTemplate.postForObject(
                bookingServiceUrl + "/api/bookings/request",
                entity,
                Map.class
        );

        success++;
        log.info("✅ Seeded booking for carId {}", carId);

      } catch (Exception e) {
        log.warn("⚠️ Skipped booking for carId {}: {}", entry[0], e.getMessage());
      }
    }

    log.info("✅ Seeded {}/{} bookings", success, entries.size());
  }
}
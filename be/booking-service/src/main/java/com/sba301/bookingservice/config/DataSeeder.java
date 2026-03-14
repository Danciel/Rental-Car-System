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

    HttpHeaders headers = new HttpHeaders();
        Map<String, Object> body = Map.of(
                "carId",         carId,

    bookingRepository.saveAll(mockBookings);
    log.info("✅ Seeded {} diverse bookings successfully!", mockBookings.size());
  }
}
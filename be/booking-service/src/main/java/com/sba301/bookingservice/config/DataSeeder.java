package com.sba301.bookingservice.config;

import com.sba301.bookingservice.entities.Booking;
import com.sba301.bookingservice.entities.BookingStatus;
import com.sba301.bookingservice.repositories.BookingRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

  private final BookingRepository bookingRepository;

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

    bookingRepository.saveAll(mockBookings);
    log.info("✅ Seeded {} diverse bookings successfully!", mockBookings.size());
  }
}
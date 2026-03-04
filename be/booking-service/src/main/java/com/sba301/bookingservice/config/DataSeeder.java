package com.sba301.bookingservice.config;

import com.sba301.bookingservice.entities.Booking;
import com.sba301.bookingservice.entities.BookingStatus;
import com.sba301.bookingservice.repositories.BookingRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
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

    log.info("Seeding initial booking history data...");

    LocalDateTime now = LocalDateTime.now();

    Booking b1 = Booking.builder()
        .bookingCode("BKG-SEED-001")
        .userId(1L)
        .carId(101L)
        .startTime(now.plusDays(5))
        .endTime(now.plusDays(8))
        .status(BookingStatus.CONFIRMED)
        .totalPrice(BigDecimal.valueOf(1_500_000))
        .depositAmount(BigDecimal.valueOf(500_000))
        .createdAt(now.minusDays(1))
        .build();

    Booking b2 = Booking.builder()
        .bookingCode("BKG-SEED-002")
        .userId(1L)
        .carId(102L)
        .startTime(now.minusDays(15))
        .endTime(now.minusDays(12))
        .status(BookingStatus.CONFIRMED)
        .totalPrice(BigDecimal.valueOf(1_800_000))
        .depositAmount(BigDecimal.valueOf(500_000))
        .createdAt(now.minusDays(20))
        .build();

    Booking b3 = Booking.builder()
        .bookingCode("BKG-SEED-003")
        .userId(1L)
        .carId(103L)
        .startTime(now.minusDays(30))
        .endTime(now.minusDays(28))
        .status(BookingStatus.CANCELLED)
        .totalPrice(BigDecimal.valueOf(1_400_000))
        .depositAmount(BigDecimal.valueOf(500_000))
        .createdAt(now.minusDays(35))
        .build();

    bookingRepository.save(b1);
    bookingRepository.save(b2);
    bookingRepository.save(b3);

    log.info("Seeded {} bookings for user 1", bookingRepository.count());
  }
}


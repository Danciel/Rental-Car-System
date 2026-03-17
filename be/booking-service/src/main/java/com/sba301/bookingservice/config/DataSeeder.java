package com.sba301.bookingservice.config;

import com.sba301.bookingservice.entities.Booking;
import com.sba301.bookingservice.entities.BookingStatus;
import com.sba301.bookingservice.repositories.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Slf4j
@Configuration
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

  private final BookingRepository bookingRepository;

  // ─────────────────────────────────────────────
  // CAR GROUPS BASED ON YOUR CAR SEEDER
  // (VERY IMPORTANT: MATCHES REAL DISTRIBUTION)
  // ─────────────────────────────────────────────

  // Toyota (many cars)
  private static final List<Long> TOYOTA = List.of(1L,2L,3L,4L,5L,6L,7L,8L,9L,10L);

  // Honda
  private static final List<Long> HONDA = List.of(11L,12L,13L,14L,15L,16L);

  // Ford
  private static final List<Long> FORD = List.of(17L,18L,19L);

  // Tesla / Hyundai / Kia / Mazda
  private static final List<Long> MIXED = List.of(20L,21L,22L,23L,24L,25L,26L);

  // Luxury
  private static final List<Long> LUXURY = List.of(27L,28L);

  // Vinfast
  private static final List<Long> VINFAST = List.of(29L,30L,31L,32L);

  @Override
  public void run(String... args) {

    if (bookingRepository.count() > 0) {
      log.info("Skipping booking data seeding because data already exists");
      return;
    }

    log.info("🌱 Seeding 50 bookings aligned with car distribution...");

    LocalDateTime now = LocalDateTime.now();
    Long userId = 1L;

    List<Booking> bookings = new ArrayList<>();

    for (int i = 1; i <= 50; i++) {

      int daysOffset = ThreadLocalRandom.current().nextInt(-30, 8);

      LocalDateTime start = now.plusDays(daysOffset)
              .withHour(10).withMinute(0).withSecond(0).withNano(0);

      LocalDateTime end = start.plusDays(
              ThreadLocalRandom.current().nextInt(1, 5)
      );

      Long carId = randomCarId();
      BigDecimal price = generatePriceByCarGroup(carId);

      Booking booking = Booking.builder()
              .bookingCode("BKG-" + i)
              .userId(userId)
              .carId(carId)
              .startTime(start)
              .endTime(end)
              .status(randomStatus())
              .totalPrice(price)
              .depositAmount(price.multiply(BigDecimal.valueOf(0.3)))
              .createdAt(start.minusDays(2))
              .build();

      bookings.add(booking);
    }

    bookingRepository.saveAll(bookings);

    log.info("✅ Seeded {} bookings", bookings.size());
  }

  // ─────────────────────────────────────────────
  // STATUS DISTRIBUTION
  // ─────────────────────────────────────────────
  private BookingStatus randomStatus() {
    int r = ThreadLocalRandom.current().nextInt(100);

    if (r < 65) return BookingStatus.COMPLETED;
    if (r < 80) return BookingStatus.CONFIRMED;
    if (r < 95) return BookingStatus.PENDING_PAYMENT;
    return BookingStatus.CANCELLED;
  }

  // ─────────────────────────────────────────────
  // MATCH REAL BRAND DISTRIBUTION
  // ─────────────────────────────────────────────
  private Long randomCarId() {
    int r = ThreadLocalRandom.current().nextInt(100);

    if (r < 30) return pick(TOYOTA);      // dominant
    if (r < 50) return pick(HONDA);
    if (r < 65) return pick(MIXED);
    if (r < 80) return pick(VINFAST);
    if (r < 90) return pick(FORD);
    return pick(LUXURY);                  // rare but high value
  }

  private Long pick(List<Long> list) {
    return list.get(ThreadLocalRandom.current().nextInt(list.size()));
  }

  // ─────────────────────────────────────────────
  // PRICE BASED ON CAR TYPE (VERY IMPORTANT)
  // ─────────────────────────────────────────────
  private BigDecimal generatePriceByCarGroup(Long carId) {

    int days = ThreadLocalRandom.current().nextInt(1, 5);

    // Luxury cars → expensive
    if (LUXURY.contains(carId)) {
      return BigDecimal.valueOf(days * ThreadLocalRandom.current().nextInt(2_000_000, 3_000_000));
    }

    // Ford pickup → mid-high
    if (FORD.contains(carId)) {
      return BigDecimal.valueOf(days * ThreadLocalRandom.current().nextInt(1_200_000, 2_000_000));
    }

    // Toyota / Honda → common
    if (TOYOTA.contains(carId) || HONDA.contains(carId)) {
      return BigDecimal.valueOf(days * ThreadLocalRandom.current().nextInt(700_000, 1_500_000));
    }

    // Others
    return BigDecimal.valueOf(days * ThreadLocalRandom.current().nextInt(800_000, 1_800_000));
  }
}
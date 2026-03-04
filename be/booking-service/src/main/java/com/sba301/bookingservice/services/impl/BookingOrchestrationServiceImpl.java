package com.sba301.bookingservice.services.impl;

import com.sba301.bookingservice.client.CarServiceClient;
import com.sba301.bookingservice.client.UserServiceClient;
import com.sba301.bookingservice.dto.BookCarAndPayRequest;
import com.sba301.bookingservice.dto.BookCarAndPayResponse;
import com.sba301.bookingservice.entities.Booking;
import com.sba301.bookingservice.entities.BookingStatus;
import com.sba301.bookingservice.entities.RentalContract;
import com.sba301.bookingservice.entities.RentalContractStatus;
import com.sba301.bookingservice.repositories.BookingRepository;
import com.sba301.bookingservice.repositories.RentalContractRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Slf4j
@Service
@RequiredArgsConstructor
public class BookingOrchestrationServiceImpl implements com.sba301.bookingservice.services.BookingOrchestrationService {

  private final BookingRepository bookingRepository;
  private final RentalContractRepository rentalContractRepository;
  private final CarServiceClient carServiceClient;
  private final UserServiceClient userServiceClient;
  // ═════════════════════════════════════════════════════════════════════════
  // MAIN ORCHESTRATION
  // ═════════════════════════════════════════════════════════════════════════

  @Override
  @Transactional
  public BookCarAndPayResponse bookCarAndDoPayment(BookCarAndPayRequest request, String email) {

    // ── STEP 1: Verify user ───────────────────────────────────────────────
    Long userId = verifyUser(email);

    // ── STEP 2: Verify car is available ──────────────────────────────────
    verifyCarAvailable(request.carId());

    LocalDateTime now = LocalDateTime.now();

    // ── STEP 3: Create booking ────────────────────────────────────────────
    Booking booking = createBooking(request, userId, now);

    // ── STEP 4: Create rental contract ───────────────────────────────────
    RentalContract rentalContract = createRentalContract(request, booking, now);

    // ── STEP 5: Link contract back to booking ─────────────────────────────
    booking.setRentalContract(rentalContract);

    // ── STEP 6: Update car status to RENTED ──────────────────────────────
    updateCarToRented(request.carId(), email);

    return buildResponse(booking, rentalContract);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // STEP FUNCTIONS
  // ═════════════════════════════════════════════════════════════════════════

  private Long verifyUser(String email) {
    Long userId = userServiceClient.getAuthenticatedUserId(email);
    if (userId == null) {
      log.error("Failed to verify user with email: {}", email);
      throw new RuntimeException("Không tìm thấy người dùng hoặc chưa đăng nhập");
    }
    log.info("Verified user id: {} for email: {}", userId, email);
    return userId;
  }

  private void verifyCarAvailable(Long carId) {
    if (!carServiceClient.isCarAvailable(carId)) {
      log.error("Car {} is not available for booking", carId);
      throw new RuntimeException("Xe không khả dụng để đặt thuê");
    }
    log.info("Car {} is available for booking", carId);
  }

  private Booking createBooking(BookCarAndPayRequest request, Long userId, LocalDateTime now) {
    try {
      Booking booking = Booking.builder()
              .bookingCode(generateBookingCode())
              .userId(userId)
              .carId(request.carId())
              .startTime(request.startTime())
              .endTime(request.endTime())
              .status(BookingStatus.CONFIRMED)
              .totalPrice(request.rentalPrice())
              .depositAmount(request.depositAmount())
              .createdAt(now)
              .build();

      booking = bookingRepository.save(booking);
      log.info("Created booking: {}", booking.getBookingCode());
      return booking;
    } catch (Exception e) {
      log.error("Failed to create booking for carId {}: {}", request.carId(), e.getMessage());
      throw new RuntimeException("Không thể tạo booking: " + e.getMessage());
    }
  }

  private RentalContract createRentalContract(BookCarAndPayRequest request, Booking booking, LocalDateTime now) {
    try {
      RentalContract rentalContract = RentalContract.builder()
              .booking(booking)
              .contractNumber(generateContractNumber())
              .startTime(request.startTime())
              .endTime(request.endTime())
              .status(RentalContractStatus.ACTIVE)
              .rentalPrice(request.rentalPrice())
              .depositAmount(request.depositAmount())
              .totalAmount(calculateTotalAmount(request.rentalPrice(), request.depositAmount()))
              .createdAt(now)
              .build();

      rentalContract = rentalContractRepository.save(rentalContract);
      log.info("Created rental contract: {}", rentalContract.getContractNumber());
      return rentalContract;
    } catch (Exception e) {
      log.error("Failed to create rental contract for booking {}: {}", booking.getBookingCode(), e.getMessage());
      throw new RuntimeException("Không thể tạo hợp đồng thuê: " + e.getMessage());
    }
  }

  private void updateCarToRented(Long carId, String email) {
    try {
      carServiceClient.updateCarStatus(carId, "RENTED", email);
      log.info("Updated car {} status to RENTED", carId);
    } catch (Exception e) {
      log.error("Failed to update car {} to RENTED: {}", carId, e.getMessage());
      throw new RuntimeException("Không thể cập nhật trạng thái xe: " + e.getMessage());
    }
  }

  private BookCarAndPayResponse buildResponse(Booking booking, RentalContract rentalContract) {
    return new BookCarAndPayResponse(
            booking.getId(),
            booking.getBookingCode(),
            rentalContract.getId(),
            booking.getStatus(),
            rentalContract.getStatus()
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // PRIVATE HELPERS
  // ═════════════════════════════════════════════════════════════════════════


  private String generateBookingCode() {
    return "BKG-" + UUID.randomUUID();
  }

  private String generateContractNumber() {
    return "RC-" + UUID.randomUUID();
  }

  private BigDecimal calculateTotalAmount(BigDecimal rentalPrice, BigDecimal depositAmount) {
    return rentalPrice.add(depositAmount);
  }



}


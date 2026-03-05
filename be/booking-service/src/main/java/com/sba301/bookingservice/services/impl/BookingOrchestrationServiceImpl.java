package com.sba301.bookingservice.services.impl;

import com.sba301.bookingservice.client.CarServiceClient;
import com.sba301.bookingservice.client.UserServiceClient;
import com.sba301.bookingservice.dto.BookCarAndPayRequest;
import com.sba301.bookingservice.dto.BookCarAndPayResponse;
import com.sba301.bookingservice.dtos.BookingDetailResponse;
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

  // Thêm method này vào interface BookingOrchestrationService trước nhé
  @Override
  @Transactional
  public BookingDetailResponse createBookingRequest(BookCarAndPayRequest request, String email) {

    // 1. Lấy user
    Long userId = verifyUser(email);

    // 2. Kiểm tra xe còn trống không
    verifyCarAvailable(request.carId());

    // 3. TẠO YÊU CẦU ĐẶT XE (Status: PENDING_APPROVAL)
    Booking booking = Booking.builder()
            .bookingCode(generateBookingCode())
            .userId(userId)
            .carId(request.carId())
            .startTime(request.startTime())
            .endTime(request.endTime())
            .status(BookingStatus.PENDING_APPROVAL) // Chỉ mới gửi yêu cầu
            .totalPrice(request.rentalPrice())
            //.depositAmount(request.depositAmount()) // Theo luồng mới, user thanh toán 100% nên deposit = total
            .depositAmount(request.rentalPrice())
            .createdAt(LocalDateTime.now())
            .build();

    booking = bookingRepository.save(booking);
    log.info("Created booking request: {}", booking.getBookingCode());

    // LƯU Ý: KHÔNG TẠO RENTAL CONTRACT Ở ĐÂY.
    // KHÔNG ĐỔI TRẠNG THÁI XE SANG RENTED Ở ĐÂY.

    // 4. Trả về cho Frontend
    return BookingDetailResponse.builder()
            .id(booking.getId())
            .bookingCode(booking.getBookingCode())
            .carId(booking.getCarId())
            .userId(booking.getUserId())
            .status(booking.getStatus())
            .totalPrice(booking.getTotalPrice())
            .build();
  }

  @Override
  @Transactional
  public void respondToBookingRequest(Long bookingId, boolean accept, String email) {
    // 1. Lấy ID của người đang thao tác (Chủ xe)
    Long currentUserId = verifyUser(email);

    // 2. Tìm Booking trong Database
    Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu thuê xe này"));

    // 3. Kiểm tra xem Booking có đang ở đúng trạng thái chờ duyệt không
    if (booking.getStatus() != BookingStatus.PENDING_APPROVAL) {
      throw new RuntimeException("Yêu cầu này không ở trạng thái chờ duyệt (Có thể đã được xử lý hoặc bị hủy)");
    }

    /* * LƯU Ý BẢO MẬT DÀNH CHO ĐỒ ÁN (TODO):
     * Đúng chuẩn thì ở đây bạn phải gọi qua CarServiceClient để check xem
     * currentUserId có đúng là Owner của chiếc xe (booking.getCarId()) hay không.
     * Tạm thời ở MVP này, ta giả định Frontend chỉ hiện nút Duyệt cho đúng chủ xe.
     */

    // 4. Xử lý quyết định
    if (accept) {
      booking.setStatus(BookingStatus.PENDING_PAYMENT);
      log.info("Booking {} accepted. Waiting for payment.", booking.getBookingCode());
      // (Tùy chọn) Gửi thông báo/Email cho Khách hàng biết để vào thanh toán
    } else {
      booking.setStatus(BookingStatus.REJECTED);
      log.info("Booking {} rejected by owner.", booking.getBookingCode());
    }

    // 5. Lưu lại trạng thái mới
    bookingRepository.save(booking);
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


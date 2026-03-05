package com.sba301.bookingservice.controllers;

import com.sba301.bookingservice.client.UserServiceClient;
import com.sba301.bookingservice.dto.BookCarAndPayRequest;
import com.sba301.bookingservice.dto.BookCarAndPayResponse;
import com.sba301.bookingservice.dtos.BookingDetailResponse;
import com.sba301.bookingservice.dtos.BookingHistoryItemResponse;
import com.sba301.bookingservice.entities.Booking;
import com.sba301.bookingservice.repositories.BookingRepository;
import com.sba301.bookingservice.services.BookingOrchestrationService;
import com.swb.common.dtos.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

  private final BookingOrchestrationService bookingOrchestrationService;
  private final BookingRepository bookingRepository;
  private final UserServiceClient userServiceClient;

  // Thay thế @PostMapping("/book-and-pay") cũ bằng cái này
  @PostMapping("/request")
  public ResponseEntity<ApiResponse<BookingDetailResponse>> requestBooking(
          @RequestHeader("X-User-Email") String email,
          @Valid @RequestBody BookCarAndPayRequest request) {

    BookingDetailResponse response = bookingOrchestrationService.createBookingRequest(request, email);
    return ResponseEntity.ok(ApiResponse.success(response, "Đã gửi yêu cầu thuê xe thành công. Vui lòng chờ chủ xe duyệt."));
  }

  // Thêm API này vào trong BookingController
  @PatchMapping("/{id}/respond")
  public ResponseEntity<ApiResponse<String>> respondToBooking(
          @PathVariable Long id,
          @RequestParam boolean accept,
          @RequestHeader("X-User-Email") String email) {

    bookingOrchestrationService.respondToBookingRequest(id, accept, email);

    String message = accept ? "Đã CHẤP NHẬN yêu cầu thuê xe. Khách hàng đang tiến hành thanh toán."
            : "Đã TỪ CHỐI yêu cầu thuê xe.";

    return ResponseEntity.ok(ApiResponse.success(null, message));
  }

  @GetMapping("/history")
  public ResponseEntity<ApiResponse<List<BookingHistoryItemResponse>>> getBookingHistory(
          @RequestHeader("X-User-Email") String email) {

    Long userId = userServiceClient.getAuthenticatedUserId(email);
    if (userId == null) {
      return ResponseEntity
              .status(HttpStatus.UNAUTHORIZED)
              .body(ApiResponse.error(HttpStatus.UNAUTHORIZED.value(),
                      "Không tìm thấy người dùng hoặc chưa đăng nhập"));
    }

    List<Booking> bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);

    List<BookingHistoryItemResponse> response = bookings.stream()
            .map(b -> BookingHistoryItemResponse.builder()
                    .id(b.getId())
                    .bookingCode(b.getBookingCode())
                    .carId(b.getCarId())
                    .startTime(b.getStartTime())
                    .endTime(b.getEndTime())
                    .status(b.getStatus())
                    .totalPrice(b.getTotalPrice())
                    .depositAmount(b.getDepositAmount())
                    .build())
            .collect(Collectors.toList());

    return ResponseEntity.ok(ApiResponse.success(response, "Lấy lịch sử đặt xe thành công"));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<BookingDetailResponse>> getBookingDetail(
          @PathVariable Long id,
          @RequestHeader("X-User-Email") String email) {

    Long userId = userServiceClient.getAuthenticatedUserId(email);
    if (userId == null) {
      return ResponseEntity
              .status(HttpStatus.UNAUTHORIZED)
              .body(ApiResponse.error(HttpStatus.UNAUTHORIZED.value(),
                      "Không tìm thấy người dùng hoặc chưa đăng nhập"));
    }

    Optional<Booking> bookingOpt = bookingRepository.findById(id);
    if (bookingOpt.isEmpty() || !bookingOpt.get().getUserId().equals(userId)) {
      return ResponseEntity
              .status(HttpStatus.NOT_FOUND)
              .body(ApiResponse.error(HttpStatus.NOT_FOUND.value(), "Không tìm thấy booking"));
    }

    Booking b = bookingOpt.get();
    BookingDetailResponse detail = BookingDetailResponse.builder()
            .id(b.getId())
            .bookingCode(b.getBookingCode())
            .carId(b.getCarId())
            .userId(b.getUserId())
            .startTime(b.getStartTime())
            .endTime(b.getEndTime())
            .status(b.getStatus())
            .totalPrice(b.getTotalPrice())
            .depositAmount(b.getDepositAmount())
            .createdAt(b.getCreatedAt())
            .build();

    return ResponseEntity.ok(ApiResponse.success(detail, "Lấy chi tiết booking thành công"));
  }
}


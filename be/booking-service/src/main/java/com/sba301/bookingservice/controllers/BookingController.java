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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

  private final BookingOrchestrationService bookingOrchestrationService;
  private final BookingRepository bookingRepository;
  private final UserServiceClient userServiceClient;

  @PostMapping("/book-and-pay")
  public ResponseEntity<ApiResponse<BookCarAndPayResponse>> bookCarAndDoPayment(
          @RequestHeader("X-User-Email") String email,
          @Valid @RequestBody BookCarAndPayRequest request) {
    BookCarAndPayResponse response = bookingOrchestrationService.bookCarAndDoPayment(request, email);
    return ResponseEntity.ok(ApiResponse.success(response, "Đặt xe và thanh toán thành công"));
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


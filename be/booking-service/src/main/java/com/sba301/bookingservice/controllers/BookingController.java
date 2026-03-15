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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

  private final BookingOrchestrationService bookingOrchestrationService;
  private final BookingRepository bookingRepository;
  private final UserServiceClient userServiceClient;

  @PreAuthorize("hasAnyAuthority('ROLE_CUSTOMER', 'ROLE_OWNER')")
  @PostMapping("/request")
  public ResponseEntity<ApiResponse<BookingDetailResponse>> requestBooking(
          @RequestHeader("X-User-Email") String email,
          @Valid @RequestBody BookCarAndPayRequest request) {

    BookingDetailResponse response = bookingOrchestrationService.createBookingRequest(request, email);
    return ResponseEntity.ok(ApiResponse.success(response, "Booking request sent successfully. Please wait for the car owner to approve."));
  }

  @PreAuthorize("hasAnyAuthority('ROLE_OWNER', 'ROLE_ADMIN')")
  @PatchMapping("/{id}/respond")
  public ResponseEntity<ApiResponse<String>> respondToBooking(
          @PathVariable Long id,
          @RequestParam boolean accept,
          @RequestHeader("X-User-Email") String email) {

    bookingOrchestrationService.respondToBookingRequest(id, accept, email);

    String message = accept ? "Booking request ACCEPTED. The customer is proceeding with the payment."
            : "Booking request REJECTED.";

    return ResponseEntity.ok(ApiResponse.success(null, message));
  }

  @PreAuthorize("hasAnyAuthority('ROLE_CUSTOMER', 'ROLE_OWNER')")
  @PostMapping("/{id}/mock-pay")
  public ResponseEntity<ApiResponse<String>> mockPayment(
          @PathVariable Long id,
          @RequestHeader("X-User-Email") String email) {

    bookingOrchestrationService.processMockPayment(id, email);

    return ResponseEntity.ok(ApiResponse.success(null,
            "Payment successful! The rental contract has been created and the booking schedule is locked."));
  }

  @PreAuthorize("hasAnyAuthority('ROLE_OWNER', 'ROLE_ADMIN')")
  @GetMapping("/manage")
  public ResponseEntity<ApiResponse<List<BookingDetailResponse>>> getAllBookingsForManagement() {

    // Lấy toàn bộ booking, sắp xếp mới nhất lên đầu
    // (MVP: Tạm thời cho Admin thấy hết. Sau này nếu làm P2P chuẩn, ta sẽ filter theo ownerId)
    List<Booking> bookings = bookingRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"));

    List<BookingDetailResponse> response = bookings.stream()
            .map(b -> BookingDetailResponse.builder()
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
                    .build())
            .collect(Collectors.toList());

    return ResponseEntity.ok(ApiResponse.success(response, "Booking management list retrieved successfully."));
  }

  @PreAuthorize("hasAnyAuthority('ROLE_CUSTOMER', 'ROLE_OWNER', 'ROLE_ADMIN')")
  @GetMapping("/history")
  public ResponseEntity<ApiResponse<List<BookingHistoryItemResponse>>> getBookingHistory(
          @RequestHeader("X-User-Email") String email) {

    Long userId = userServiceClient.getAuthenticatedUserId(email);
    if (userId == null) {
      return ResponseEntity
              .status(HttpStatus.UNAUTHORIZED)
              .body(ApiResponse.error(HttpStatus.UNAUTHORIZED.value(),
                      "User not found or not logged in."));
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

    return ResponseEntity.ok(ApiResponse.success(response, "Booking history retrieved successfully."));
  }

  @PreAuthorize("hasAnyAuthority('ROLE_CUSTOMER', 'ROLE_OWNER', 'ROLE_ADMIN')")
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<BookingDetailResponse>> getBookingDetail(
          @PathVariable Long id,
          @RequestHeader("X-User-Email") String email) {

    Long userId = userServiceClient.getAuthenticatedUserId(email);
    if (userId == null) {
      return ResponseEntity
              .status(HttpStatus.UNAUTHORIZED)
              .body(ApiResponse.error(HttpStatus.UNAUTHORIZED.value(),
                      "User not found or not logged in."));
    }

    Optional<Booking> bookingOpt = bookingRepository.findById(id);
    if (bookingOpt.isEmpty() || !bookingOpt.get().getUserId().equals(userId)) {
      return ResponseEntity
              .status(HttpStatus.NOT_FOUND)
              .body(ApiResponse.error(HttpStatus.NOT_FOUND.value(), "Booking not found."));
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

    return ResponseEntity.ok(ApiResponse.success(detail, "Booking details retrieved successfully."));
  }
}


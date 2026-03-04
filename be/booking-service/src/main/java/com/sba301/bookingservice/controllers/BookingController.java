package com.sba301.bookingservice.controllers;

import com.sba301.bookingservice.dto.BookCarAndPayRequest;
import com.sba301.bookingservice.dto.BookCarAndPayResponse;
import com.sba301.bookingservice.services.BookingOrchestrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

  private final BookingOrchestrationService bookingOrchestrationService;

  @PostMapping("/book-and-pay")
  public ResponseEntity<BookCarAndPayResponse> bookCarAndDoPayment(
          @RequestHeader("X-User-Email") String email,
          @Valid @RequestBody BookCarAndPayRequest request) {
    BookCarAndPayResponse response = bookingOrchestrationService.bookCarAndDoPayment(request, email);
    return ResponseEntity.ok(response);
  }
  /*
  Example request body for POST /api/bookings/book-and-pay:
  HEADERS:
    X-User-Email: owner@gmail.com

  BODY:
  {
    "userId": 1,
    "carId": 1,
    "startTime": "2026-03-10T08:00:00",
    "endTime": "2026-03-13T08:00:00",
    "rentalPrice": 800000,
    "depositAmount": 5000000
  }

   */
}


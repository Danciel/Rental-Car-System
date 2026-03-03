package com.sba301.bookingservice.controllers;

import com.sba301.bookingservice.dto.BookCarAndPayRequest;
import com.sba301.bookingservice.dto.BookCarAndPayResponse;
import com.sba301.bookingservice.services.BookingOrchestrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

  private final BookingOrchestrationService bookingOrchestrationService;

  @PostMapping("/book-and-pay")
  public ResponseEntity<BookCarAndPayResponse> bookCarAndDoPayment(
      @Valid @RequestBody BookCarAndPayRequest request) {
    BookCarAndPayResponse response = bookingOrchestrationService.bookCarAndDoPayment(request);
    return ResponseEntity.ok(response);
  }
}


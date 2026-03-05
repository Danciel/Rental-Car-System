package com.sba301.bookingservice.services;

import com.sba301.bookingservice.dto.BookCarAndPayRequest;
import com.sba301.bookingservice.dto.BookCarAndPayResponse;
import com.sba301.bookingservice.dtos.BookingDetailResponse;

public interface BookingOrchestrationService {
  BookingDetailResponse createBookingRequest(BookCarAndPayRequest request, String email);
  void respondToBookingRequest(Long bookingId, boolean accept, String email);

  //TODO: Mock Payment - Chỉ dùng để test luồng, sau này sẽ xóa đi khi tích hợp với Payment Service thật
  void processMockPayment(Long bookingId, String email);
}
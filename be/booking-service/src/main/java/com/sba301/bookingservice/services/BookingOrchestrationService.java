package com.sba301.bookingservice.services;

import com.sba301.bookingservice.dto.BookCarAndPayRequest;
import com.sba301.bookingservice.dto.BookCarAndPayResponse;

public interface BookingOrchestrationService {

  BookCarAndPayResponse bookCarAndDoPayment(BookCarAndPayRequest request, String email);
}


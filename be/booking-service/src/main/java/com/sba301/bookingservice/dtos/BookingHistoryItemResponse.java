package com.sba301.bookingservice.dtos;

import com.sba301.bookingservice.entities.BookingStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class BookingHistoryItemResponse {

  Long id;
  String bookingCode;
  Long carId;
  LocalDateTime startTime;
  LocalDateTime endTime;
  BookingStatus status;
  BigDecimal totalPrice;
  BigDecimal depositAmount;
}


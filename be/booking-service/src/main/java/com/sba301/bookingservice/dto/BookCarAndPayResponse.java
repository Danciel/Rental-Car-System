package com.sba301.bookingservice.dto;

import com.sba301.bookingservice.entities.BookingStatus;
import com.sba301.bookingservice.entities.PaymentStatus;
import com.sba301.bookingservice.entities.RentalContractStatus;

public record BookCarAndPayResponse(
    Long bookingId,
    String bookingCode,
    Long rentalContractId,
    Long carInspectReportId,
    Long paymentTransactionId,
    BookingStatus bookingStatus,
    RentalContractStatus rentalContractStatus,
    PaymentStatus paymentStatus
) {
}


package com.sba301.bookingservice.services.impl;

import com.sba301.bookingservice.dto.BookCarAndPayRequest;
import com.sba301.bookingservice.dto.BookCarAndPayResponse;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookingOrchestrationServiceImpl implements com.sba301.bookingservice.services.BookingOrchestrationService {

  private final BookingRepository bookingRepository;
  private final RentalContractRepository rentalContractRepository;
  @Override
  @Transactional
  public BookCarAndPayResponse bookCarAndDoPayment(BookCarAndPayRequest request) {
    LocalDateTime now = LocalDateTime.now();


    Booking booking = Booking.builder()
        .bookingCode(generateBookingCode())
        .userId(request.userId())
        .carId(request.carId())
        .startTime(request.startTime())
        .endTime(request.endTime())
        .status(BookingStatus.CONFIRMED)
        .totalPrice(request.rentalPrice())
        .depositAmount(request.depositAmount())
        .createdAt(now)
        .build();

    booking = bookingRepository.save(booking);

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
    booking.setRentalContract(rentalContract);

    return new BookCarAndPayResponse(
        booking.getId(),
        booking.getBookingCode(),
        rentalContract.getId(),
        booking.getStatus(),
        rentalContract.getStatus()
    );
  }

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


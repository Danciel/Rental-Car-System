package com.sba301.bookingservice.services.impl;

import com.sba301.bookingservice.dto.BookCarAndPayRequest;
import com.sba301.bookingservice.dto.BookCarAndPayResponse;
import com.sba301.bookingservice.entities.Booking;
import com.sba301.bookingservice.entities.BookingStatus;
import com.sba301.bookingservice.entities.CarInspectReport;
import com.sba301.bookingservice.entities.InspectionStatus;
import com.sba301.bookingservice.entities.PaymentStatus;
import com.sba301.bookingservice.entities.PaymentTrans;
import com.sba301.bookingservice.entities.RentalContract;
import com.sba301.bookingservice.entities.RentalContractStatus;
import com.sba301.bookingservice.repositories.BookingRepository;
import com.sba301.bookingservice.repositories.CarInspectReportRepository;
import com.sba301.bookingservice.repositories.PaymentTransRepository;
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
  private final CarInspectReportRepository carInspectReportRepository;
  private final PaymentTransRepository paymentTransRepository;

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
        .status(BookingStatus.PENDING_PAYMENT)
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
        .status(RentalContractStatus.DRAFT)
        .rentalPrice(request.rentalPrice())
        .depositAmount(request.depositAmount())
        .totalAmount(calculateTotalAmount(request.rentalPrice(), request.depositAmount()))
        .createdAt(now)
        .build();

    rentalContract = rentalContractRepository.save(rentalContract);
    booking.setRentalContract(rentalContract);

    CarInspectReport inspectReport = CarInspectReport.builder()
        .booking(booking)
        .carId(request.carId())
        .preInspectionNote(request.preInspectionNote())
        .status(InspectionStatus.PENDING)
        .createdAt(now)
        .build();

    inspectReport = carInspectReportRepository.save(inspectReport);
    booking.setCarInspectReport(inspectReport);

    PaymentTrans paymentTrans = PaymentTrans.builder()
        .booking(booking)
        .amount(request.rentalPrice())
        .depositAmount(request.depositAmount())
        .status(PaymentStatus.CAPTURED)
        .paymentMethod(request.paymentMethod())
        .externalTransactionId(generateExternalTransactionId())
        .createdAt(now)
        .build();

    paymentTrans = paymentTransRepository.save(paymentTrans);
    booking.getPayments().add(paymentTrans);

    booking.markConfirmed();
    rentalContract.markActive();

    return new BookCarAndPayResponse(
        booking.getId(),
        booking.getBookingCode(),
        rentalContract.getId(),
        inspectReport.getId(),
        paymentTrans.getId(),
        booking.getStatus(),
        rentalContract.getStatus(),
        paymentTrans.getStatus()
    );
  }

  private String generateBookingCode() {
    return "BKG-" + UUID.randomUUID();
  }

  private String generateContractNumber() {
    return "RC-" + UUID.randomUUID();
  }

  private String generateExternalTransactionId() {
    return "PAY-" + UUID.randomUUID();
  }

  private BigDecimal calculateTotalAmount(BigDecimal rentalPrice, BigDecimal depositAmount) {
    return rentalPrice.add(depositAmount);
  }
}


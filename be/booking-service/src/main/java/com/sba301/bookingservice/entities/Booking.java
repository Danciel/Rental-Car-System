package com.sba301.bookingservice.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder.Default;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true, length = 100)
  private String bookingCode;

  @Column(nullable = false)
  private Long userId;

  @Column(nullable = false)
  private Long carId;

  @Column(nullable = false)
  private LocalDateTime startTime;

  @Column(nullable = false)
  private LocalDateTime endTime;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 50)
  private BookingStatus status;

  @Column(nullable = false, precision = 18, scale = 2)
  private BigDecimal totalPrice;

  @Column(nullable = false, precision = 18, scale = 2)
  private BigDecimal depositAmount;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
  private RentalContract rentalContract;

  @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
  private CarInspectReport carInspectReport;

  @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
  @Default
  private List<PaymentTrans> payments = new ArrayList<>();

  public void markPendingPayment() {
    this.status = BookingStatus.PENDING_PAYMENT;
  }

  public void markConfirmed() {
    this.status = BookingStatus.CONFIRMED;
  }

  public void markCancelled() {
    this.status = BookingStatus.CANCELLED;
  }
}

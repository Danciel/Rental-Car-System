package com.sba301.bookingservice.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "rental_contracts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RentalContract {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(name = "booking_id", nullable = false, unique = true)
  private Booking booking;

  @Column(nullable = false, length = 100)
  private String contractNumber;

  @Column(nullable = false)
  private LocalDateTime startTime;

  @Column(nullable = false)
  private LocalDateTime endTime;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 50)
  private RentalContractStatus status;

  @Column(nullable = false, precision = 18, scale = 2)
  private BigDecimal rentalPrice;

  @Column(nullable = false, precision = 18, scale = 2)
  private BigDecimal depositAmount;

  @Column(nullable = false, precision = 18, scale = 2)
  private BigDecimal totalAmount;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  public void markActive() {
    this.status = RentalContractStatus.ACTIVE;
  }

  public void markDraft() {
    this.status = RentalContractStatus.DRAFT;
  }
}


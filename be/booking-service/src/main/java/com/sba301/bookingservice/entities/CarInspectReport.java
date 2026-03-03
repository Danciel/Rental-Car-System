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
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "car_inspect_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarInspectReport {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(name = "booking_id", nullable = false, unique = true)
  private Booking booking;

  @Column(nullable = false)
  private Long carId;

  @Column(length = 1000)
  private String preInspectionNote;

  @Column(length = 1000)
  private String postInspectionNote;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 50)
  private InspectionStatus status;

  @Column(nullable = false)
  private LocalDateTime createdAt;
}


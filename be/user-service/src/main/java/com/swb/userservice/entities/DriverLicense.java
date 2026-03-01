package com.swb.userservice.entities;

import com.swb.userservice.enums.KYCStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "driver_licenses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverLicense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, unique = true, length = 20)
    private String licenseNumber;

    @Column(nullable = false, length = 10)
    private String licenseClass; // B1, B2, C

    @Column(nullable = false)
    private LocalDate expiryDate;

    @Column(nullable = false)
    private String imageFrontUrl;

    @Column(nullable = false)
    private String imageBackUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private com.swb.userservice.enums.KYCStatus verificationStatus = KYCStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;


    public boolean isValid() {
        return expiryDate.isAfter(LocalDate.now()) && verificationStatus == KYCStatus.VERIFIED;
    }

    // TODO: submitForReview()
}

package com.swb.userservice.entities;

import com.swb.userservice.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(unique = true, length = 15)
    private String phoneNumber;

    private String avatarUrl;

    @Column(precision = 19, scale = 2, nullable = false)
    private BigDecimal walletBalance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserStatus status;

    @Column(name = "is_license_verified", nullable = false)
    private Boolean isLicenseVerified;

    private LocalDateTime deletionRequestedAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private DriverLicense driverLicense;


    public void requestAccountDeletion() {
        if (this.walletBalance.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalStateException("Không thể xóa tài khoản khi đang có dư nợ.");
        }
        this.status = UserStatus.PENDING_DELETION;
        this.deletionRequestedAt = LocalDateTime.now();
    }

    /*
    TODO:
    changePassword(String oldPassword, String newPassword)
    updateProfile(UserDTO userDTO)
    verifyEmail(String verificationCode)
    */
}
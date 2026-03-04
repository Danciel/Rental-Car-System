package com.swb.userservice.dtos;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
public class UserProfileResponse {
    private Long id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String avatarUrl;
    private BigDecimal walletBalance;
    private String status;
    private Set<String> roles;
    private boolean isLicenseVerified;
}
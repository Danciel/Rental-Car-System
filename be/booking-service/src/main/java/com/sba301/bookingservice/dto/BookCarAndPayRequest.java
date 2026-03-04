package com.sba301.bookingservice.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BookCarAndPayRequest(
    @NotNull Long userId,
    @NotNull Long carId,
    @NotNull @Future LocalDateTime startTime,
    @NotNull @Future LocalDateTime endTime,
    @NotNull BigDecimal rentalPrice,
    @NotNull BigDecimal depositAmount
) {
}


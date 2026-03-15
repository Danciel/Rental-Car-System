package com.swd.paymentservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingProcessRequest {
    private Long senderId;
    private BigDecimal amount;
    private String description;
}

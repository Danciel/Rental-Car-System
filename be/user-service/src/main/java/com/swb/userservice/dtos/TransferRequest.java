package com.swb.userservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransferRequest {
    private Long senderId;
    private Long receiverId;
    private BigDecimal amount;
    private String description;
}

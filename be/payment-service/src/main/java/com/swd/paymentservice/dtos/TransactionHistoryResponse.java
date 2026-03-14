package com.swd.paymentservice.dtos;

import com.swd.paymentservice.enums.TransactionStatus;
import com.swd.paymentservice.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionHistoryResponse {
    private Long id;
    private String transactionCode;

    private Long senderId;
    private String senderName;

    private Long receiverId;
    private String receiverName;

    private BigDecimal amount;
    private TransactionType type;
    private TransactionStatus status;
    private String description;

    private BigDecimal postBalance;
    private LocalDateTime createdAt;
}

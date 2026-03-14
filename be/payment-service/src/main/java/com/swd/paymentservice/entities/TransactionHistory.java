package com.swd.paymentservice.entities;

import com.swd.paymentservice.enums.TransactionStatus;
import com.swd.paymentservice.enums.TransactionType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transaction_history")
@Getter
@Setter
@NoArgsConstructor
public class TransactionHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Chỉ lưu ID của người gửi (từ User Service)
    @Column(name = "sender_id")
    private Long senderId;

    // Chỉ lưu ID của người nhận (từ User Service)
    @Column(name = "receiver_id")
    private Long receiverId;

    @Column(name = "sender_name")
    private String senderName;

    @Column(name = "receiver_name")
    private String receiverName;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    // Số dư sau khi thực hiện giao dịch (Lấy từ User Service tại thời điểm giao dịch)
    @Column(precision = 19, scale = 2)
    private BigDecimal postBalanceSender;

    @Column(precision = 19, scale = 2)
    private BigDecimal postBalanceReceiver;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionStatus status;

    @Column(length = 500)
    private String description;

    @Column(unique = true, length = 50)
    private String transactionCode;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt =  LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (this.status == null) this.status = TransactionStatus.SUCCESS;
    }
}
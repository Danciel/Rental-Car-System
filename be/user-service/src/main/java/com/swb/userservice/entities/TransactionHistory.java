package com.swb.userservice.entities;

import com.swb.userservice.enums.TransactionStatus;
import com.swb.userservice.enums.TransactionType;
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

    // Người thực hiện/Người gửi tiền
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private User sender;

    // Người nhận tiền (Trong trường hợp của bạn có thể là Admin)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id")
    private User receiver;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    // Số dư sau khi thực hiện giao dịch (Rất quan trọng để đối soát lỗi)
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
    private String description; // Nội dung thanh toán (ví dụ: "Thanh toán thuê xe CR-123")

    @Column(unique = true, length = 50)
    private String transactionCode; // Mã giao dịch duy nhất (Ví dụ: TX20240312xxxx)

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = TransactionStatus.SUCCESS;
    }
}

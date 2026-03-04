package com.swd.paymentservice.entities;

import com.swd.paymentservice.enums.PaymentMethod;
import com.swd.paymentservice.enums.PaymentStatus;
import com.swd.paymentservice.enums.PaymentType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "payment_transaction",
        indexes = {
                @Index(name = "idx_payment_booking_no", columnList = "bookingNo"),
                @Index(name = "idx_payment_user_id", columnList = "userId"),
                @Index(name = "idx_payment_txn_ref", columnList = "txnRefCode"),
                @Index(name = "idx_payment_gateway_txn", columnList = "gatewayTxnId")
        }
)
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String bookingNo;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentStatus status;

    @Column(length = 100)
    private String txnRefCode;

    @Column(length = 100)
    private String gatewayTxnId;

    @Column(length = 50)
    private String gatewayResponseCode;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime payDate;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = PaymentStatus.PENDING;
    }
}
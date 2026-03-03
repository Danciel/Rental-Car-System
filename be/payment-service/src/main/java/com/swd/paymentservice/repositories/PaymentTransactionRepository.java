package com.swd.paymentservice.repositories;

import com.swd.paymentservice.entities.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    Optional<PaymentTransaction> findByTxnRefCode(String txnRefCode);

    Optional<PaymentTransaction> findByBookingNo(String bookingNo);
}

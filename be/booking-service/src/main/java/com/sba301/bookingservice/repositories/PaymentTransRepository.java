package com.sba301.bookingservice.repositories;

import com.sba301.bookingservice.entities.PaymentTrans;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentTransRepository extends JpaRepository<PaymentTrans, Long> {
}


package com.swd.paymentservice.repositories;

import com.swd.paymentservice.entities.TransactionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionHistoryRepository extends
        JpaRepository<TransactionHistory, Long>,
        JpaSpecificationExecutor<TransactionHistory> {
}

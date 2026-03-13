package com.swb.userservice.repositories;

import com.swb.userservice.entities.TransactionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

@Repository
public interface TransactionHistoryRepository extends
        JpaRepository<TransactionHistory, Long>,
        JpaSpecificationExecutor<TransactionHistory> {
}

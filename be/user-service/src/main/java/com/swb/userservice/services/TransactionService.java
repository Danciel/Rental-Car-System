package com.swb.userservice.services;

import com.swb.userservice.dtos.TransactionHistoryResponse;
import com.swb.userservice.dtos.TransactionRequest;
import com.swb.userservice.enums.TransactionStatus;
import com.swb.userservice.enums.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TransactionService {
    void deposit(TransactionRequest request);
    void withdraw(TransactionRequest request);
    void transferToAdmin(TransactionRequest request);
    void transferFromAdminToUser(TransactionRequest request);
    Page<TransactionHistoryResponse> getTransactionHistory(
            Long userId,
            TransactionType type,
            TransactionStatus status,
            Pageable pageable
    );

    Page<TransactionHistoryResponse> getAllTransactions(
            TransactionType type,
            TransactionStatus status,
            Pageable pageable
    );
}

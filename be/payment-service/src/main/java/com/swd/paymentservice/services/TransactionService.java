package com.swd.paymentservice.services;

import com.swd.paymentservice.dtos.TransactionHistoryResponse;
import com.swd.paymentservice.dtos.TransactionRequest;
import com.swd.paymentservice.enums.TransactionStatus;
import com.swd.paymentservice.enums.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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

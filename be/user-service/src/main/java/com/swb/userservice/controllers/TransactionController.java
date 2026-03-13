package com.swb.userservice.controllers;

import com.swb.common.dtos.ApiResponse;
import com.swb.userservice.dtos.TransactionRequest;
import com.swb.userservice.dtos.TransactionHistoryResponse;
import com.swb.userservice.enums.TransactionStatus;
import com.swb.userservice.enums.TransactionType;
import com.swb.userservice.services.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse<Void>> deposit(@RequestBody TransactionRequest request) {
        transactionService.deposit(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Nạp tiền vào tài khoản thành công"));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<ApiResponse<Void>> withdraw(@RequestBody TransactionRequest request) {
        transactionService.withdraw(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Rút tiền thành công"));
    }

    @PostMapping("/pay")
    public ResponseEntity<ApiResponse<Void>> payToAdmin(@RequestBody TransactionRequest request) {
        transactionService.transferToAdmin(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Thanh toán cho hệ thống thành công"));
    }

    @PostMapping("/refund")
    public ResponseEntity<ApiResponse<Void>> refundToUser(@RequestBody TransactionRequest request) {
        transactionService.transferFromAdminToUser(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Hoàn tiền cho người dùng thành công"));
    }

    @GetMapping("/history/all")
    public ResponseEntity<ApiResponse<Page<TransactionHistoryResponse>>> getAllTransactions(
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) TransactionStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        // Logic xử lý Sort tương tự như getHistory
        String[] sortParams = sort.split(",");
        Sort sortOrder = sortParams[1].equalsIgnoreCase("asc")
                ? Sort.by(sortParams[0]).ascending()
                : Sort.by(sortParams[0]).descending();

        Pageable pageable = PageRequest.of(page, size, sortOrder);

        Page<TransactionHistoryResponse> result = transactionService.getAllTransactions(type, status, pageable);

        return ResponseEntity.ok(ApiResponse.success(result, "Lấy toàn bộ danh sách giao dịch hệ thống thành công"));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<ApiResponse<Page<TransactionHistoryResponse>>> getHistory(
            @PathVariable Long userId,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) TransactionStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        // Tách chuỗi sort
        String[] sortParams = sort.split(",");
        String property = sortParams[0];
        Sort.Direction direction = (sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc"))
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, property));

        Page<TransactionHistoryResponse> result = transactionService.getTransactionHistory(userId, type, status, pageable);

        return ResponseEntity.ok(ApiResponse.success(result, "Lấy lịch sử giao dịch thành công"));
    }
}
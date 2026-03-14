package com.swd.paymentservice.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.Map;

import com.swd.paymentservice.client.UserServiceClient; // Import Client của bạn
import com.swd.paymentservice.dtos.TransactionRequest;
import com.swd.paymentservice.repositories.TransactionHistoryRepository;
import lombok.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

import com.swd.paymentservice.enums.TransactionType;
import com.swd.paymentservice.enums.TransactionStatus;
import com.swd.paymentservice.entities.TransactionHistory;
import com.swd.paymentservice.dtos.TransactionHistoryResponse;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionHistoryRepository historyRepository;
    private final UserServiceClient userServiceClient; // Sử dụng Client thay cho Repository

    private static final String ADMIN_EMAIL = "admin@gmail.com";
    private static final String SYSTEM_NAME = "SYSTEM";

    @Override
    @Transactional
    public void deposit(TransactionRequest request) {
        Map<String, Object> userData = userServiceClient.updateWallet(request.getUserId(), request.getAmount());

        BigDecimal postBalance = new BigDecimal(userData.get("walletBalance").toString());
        String fullName = (String) userData.get("fullName");

        // Nạp tiền: Sender là Hệ thống, Receiver là User
        saveHistory(null, SYSTEM_NAME, request.getUserId(), fullName,
                request.getAmount(), TransactionType.DEPOSIT, request.getDescription(),
                null, postBalance);
    }

    @Override
    @Transactional
    public void withdraw(TransactionRequest request) {
        Map<String, Object> userData = userServiceClient.updateWallet(request.getUserId(), request.getAmount().negate());

        BigDecimal postBalance = new BigDecimal(userData.get("walletBalance").toString());
        String fullName = (String) userData.get("fullName");

        // Rút tiền: Sender là User, Receiver là Hệ thống
        saveHistory(request.getUserId(), fullName, null, SYSTEM_NAME,
                request.getAmount(), TransactionType.WITHDRAW, request.getDescription(),
                postBalance, null);
    }

    @Override
    @Transactional
    public void transferToAdmin(TransactionRequest request) {
        // Lấy thông tin Admin
        Map<String, Object> adminProfile = userServiceClient.getUserProfile(
                userServiceClient.getAuthenticatedUserId(ADMIN_EMAIL)
        );
        Long adminId = Long.valueOf(adminProfile.get("id").toString());
        String adminName = (String) adminProfile.get("fullName");

        // Cập nhật ví và lấy thông tin người gửi
        Map<String, Object> senderData = userServiceClient.updateWallet(request.getUserId(), request.getAmount().negate());
        userServiceClient.updateWallet(adminId, request.getAmount());

        BigDecimal postSender = new BigDecimal(senderData.get("walletBalance").toString());
        String senderName = (String) senderData.get("fullName");

        saveHistory(request.getUserId(), senderName, adminId, adminName,
                request.getAmount(), TransactionType.PAYMENT, request.getDescription(),
                postSender, null);
    }

    @Override
    @Transactional
    public void transferFromAdminToUser(TransactionRequest request) {
        // 1. Lấy ID của Admin từ email
        Long adminId = userServiceClient.getAuthenticatedUserId(ADMIN_EMAIL);
        if (adminId == null) throw new RuntimeException("Hệ thống chưa thiết lập tài khoản Admin.");

        // 2. Trừ tiền admin thông qua User Service
        Map<String, Object> adminData = userServiceClient.updateWallet(adminId, request.getAmount().negate());

        // 3. Cộng tiền cho user thông qua User Service
        Map<String, Object> userData = userServiceClient.updateWallet(request.getUserId(), request.getAmount());

        // 4. Trích xuất thông tin Số dư sau giao dịch và Họ tên từ Map trả về
        BigDecimal postAdmin = new BigDecimal(adminData.get("walletBalance").toString());
        String adminName = (String) adminData.get("fullName");

        BigDecimal postUser = new BigDecimal(userData.get("walletBalance").toString());
        String userName = (String) userData.get("fullName");

        // 5. Lưu vào lịch sử giao dịch với đầy đủ tên để hiển thị nhanh sau này
        saveHistory(
                adminId, adminName,          // Thông tin người gửi (Admin)
                request.getUserId(), userName, // Thông tin người nhận (User)
                request.getAmount(),
                TransactionType.REFUND,
                request.getDescription(),
                postAdmin,
                postUser
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TransactionHistoryResponse> getTransactionHistory(
            Long userId, TransactionType type, TransactionStatus status, Pageable pageable) {

        Specification<TransactionHistory> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Truy vấn trực tiếp trên Long senderId/receiverId
            predicates.add(cb.or(
                    cb.equal(root.get("senderId"), userId),
                    cb.equal(root.get("receiverId"), userId)
            ));

            if (type != null) predicates.add(cb.equal(root.get("type"), type));
            if (status != null) predicates.add(cb.equal(root.get("status"), status));

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return historyRepository.findAll(spec, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TransactionHistoryResponse> getAllTransactions(
            TransactionType type, TransactionStatus status, Pageable pageable) {

        Specification<TransactionHistory> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (type != null) predicates.add(cb.equal(root.get("type"), type));
            if (status != null) predicates.add(cb.equal(root.get("status"), status));
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return historyRepository.findAll(spec, pageable).map(this::mapToResponse);
    }

    // Helper method cập nhật để nhận thêm Name
    private void saveHistory(Long senderId, String senderName, Long receiverId, String receiverName,
                             BigDecimal amount, TransactionType type, String desc,
                             BigDecimal postSender, BigDecimal postReceiver) {
        TransactionHistory history = new TransactionHistory();
        history.setSenderId(senderId);
        history.setSenderName(senderName); // Lưu tên vào DB
        history.setReceiverId(receiverId);
        history.setReceiverName(receiverName); // Lưu tên vào DB

        history.setAmount(amount);
        history.setType(type);
        history.setStatus(TransactionStatus.SUCCESS);
        history.setDescription(desc);
        history.setTransactionCode("TX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        history.setPostBalanceSender(postSender);
        history.setPostBalanceReceiver(postReceiver);

        historyRepository.save(history);
    }

    private TransactionHistoryResponse mapToResponse(TransactionHistory h) {
        return TransactionHistoryResponse.builder()
                .id(h.getId())
                .transactionCode(h.getTransactionCode())
                .senderId(h.getSenderId())
                .senderName(h.getSenderName()) // Lấy trực tiếp từ DB Payment
                .receiverId(h.getReceiverId())
                .receiverName(h.getReceiverName()) // Lấy trực tiếp từ DB Payment
                .amount(h.getAmount())
                .type(h.getType())
                .status(h.getStatus())
                .description(h.getDescription())
                .createdAt(h.getCreatedAt())
                .build();
    }
}
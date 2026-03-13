package com.swb.userservice.services;

// Java Standard
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

// Spring Data & JPA
import com.swb.userservice.dtos.TransactionRequest;
import com.swb.userservice.entities.User;
import com.swb.userservice.repositories.TransactionHistoryRepository;
import com.swb.userservice.repositories.UserRepository;
import lombok.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

// Dự án của bạn
import com.swb.userservice.enums.TransactionType;
import com.swb.userservice.enums.TransactionStatus;
import com.swb.userservice.entities.TransactionHistory;
import com.swb.userservice.dtos.TransactionHistoryResponse;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final UserRepository userRepository;
    private final TransactionHistoryRepository historyRepository;

    // Email Admin cố định thay vì ID
    private static final String ADMIN_EMAIL = "admin@gmail.com";

    @Override
    @Transactional
    public void deposit(TransactionRequest request) {
        User user = getUser(request.getUserId());
        user.setWalletBalance(user.getWalletBalance().add(request.getAmount()));
        userRepository.save(user);

        saveHistory(null, user, request.getAmount(), TransactionType.DEPOSIT, request.getDescription());
    }

    @Override
    @Transactional
    public void withdraw(TransactionRequest request) {
        User user = getUser(request.getUserId());
        validateBalance(user, request.getAmount());

        user.setWalletBalance(user.getWalletBalance().subtract(request.getAmount()));
        userRepository.save(user);

        saveHistory(user, null, request.getAmount(), TransactionType.WITHDRAW, request.getDescription());
    }

    @Override
    @Transactional
    public void transferToAdmin(TransactionRequest request) {
        User sender = getUser(request.getUserId());
        User admin = getAdmin(); // Tìm admin qua email

        validateBalance(sender, request.getAmount());

        sender.setWalletBalance(sender.getWalletBalance().subtract(request.getAmount()));
        admin.setWalletBalance(admin.getWalletBalance().add(request.getAmount()));

        userRepository.saveAll(List.of(sender, admin));
        saveHistory(sender, admin, request.getAmount(), TransactionType.PAYMENT, request.getDescription());
    }

    @Override
    @Transactional
    public void transferFromAdminToUser(TransactionRequest request) {
        User admin = getAdmin(); // Tìm admin qua email
        User receiver = getUser(request.getUserId());

        validateBalance(admin, request.getAmount());

        admin.setWalletBalance(admin.getWalletBalance().subtract(request.getAmount()));
        receiver.setWalletBalance(receiver.getWalletBalance().add(request.getAmount()));

        userRepository.saveAll(List.of(admin, receiver));
        saveHistory(admin, receiver, request.getAmount(), TransactionType.REFUND, request.getDescription());
    }

    private User getAdmin() {
        return userRepository.findByEmail(ADMIN_EMAIL)
                .orElseThrow(() -> new RuntimeException("Hệ thống chưa thiết lập tài khoản Admin với email: " + ADMIN_EMAIL));
    }

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TransactionHistoryResponse> getTransactionHistory(
            Long userId,
            TransactionType type,
            TransactionStatus status,
            Pageable pageable) {

        Specification<TransactionHistory> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Lọc theo User (là người gửi HOẶC người nhận)
            predicates.add(cb.or(
                    cb.equal(root.get("sender").get("id"), userId),
                    cb.equal(root.get("receiver").get("id"), userId)
            ));

            // Lọc theo loại giao dịch (nếu có)
            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }

            // Lọc theo trạng thái (nếu có)
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return historyRepository.findAll(spec, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TransactionHistoryResponse> getAllTransactions(
            TransactionType type,
            TransactionStatus status,
            Pageable pageable) {

        Specification<TransactionHistory> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Lọc theo loại giao dịch nếu Admin chọn
            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }

            // Lọc theo trạng thái nếu Admin chọn
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return historyRepository.findAll(spec, pageable).map(this::mapToResponse);
    }

    private void saveHistory(User sender, User receiver, BigDecimal amount, TransactionType type, String desc) {
        TransactionHistory history = new TransactionHistory();
        history.setSender(sender);
        history.setReceiver(receiver);
        history.setAmount(amount);
        history.setType(type);
        history.setStatus(TransactionStatus.SUCCESS);
        history.setDescription(desc);
        history.setTransactionCode("TX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        if (sender != null) history.setPostBalanceSender(sender.getWalletBalance());
        if (receiver != null) history.setPostBalanceReceiver(receiver.getWalletBalance());

        historyRepository.save(history);
    }

    private void validateBalance(User user, BigDecimal amount) {
        if (user.getWalletBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance: " + user.getEmail());
        }
    }

    private TransactionHistoryResponse mapToResponse(TransactionHistory h) {
        return TransactionHistoryResponse.builder()
                .id(h.getId())
                .transactionCode(h.getTransactionCode())
                .senderId(h.getSender() != null ? h.getSender().getId() : null)
                .senderName(h.getSender() != null ? h.getSender().getFullName() : "SYSTEM")
                .receiverId(h.getReceiver() != null ? h.getReceiver().getId() : null)
                .receiverName(h.getReceiver() != null ? h.getReceiver().getFullName() : "SYSTEM")
                .amount(h.getAmount())
                .type(h.getType())
                .status(h.getStatus())
                .description(h.getDescription())
                .createdAt(h.getCreatedAt())
                .build();
    }
}
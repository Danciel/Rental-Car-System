package com.swd.paymentservice.config;

import com.swd.paymentservice.entities.TransactionHistory;
import com.swd.paymentservice.enums.TransactionStatus;
import com.swd.paymentservice.enums.TransactionType;
import com.swd.paymentservice.repositories.TransactionHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final TransactionHistoryRepository transactionRepository;
    private final DecimalFormat df = new DecimalFormat("#,###");

    @Override
    public void run(String... args) throws Exception {
        if (transactionRepository.count() == 0) {
            log.info("🌱 Khởi tạo 17 dữ liệu mẫu cho Payment Service (Random 4 ngày gần nhất)...");

            List<TransactionHistory> transactions = new ArrayList<>();
            Random random = new Random();

            TransactionType[] allowedTypes = {
                    TransactionType.DEPOSIT,
                    TransactionType.PAYMENT,
                    TransactionType.REFUND
            };

            String[] bookingCodes = {
                    "BKG-8f72e8f2-b2a6-4192-8b64-b0199c5321e8", "BKG-54ef9a3a-99ff-4bdd-a7d4-1ec907b1ad70",
                    "BKG-9ad19656-2ca8-455a-a0dd-831557342f05", "BKG-888681b5-748c-4bed-9a4a-ba0afc81dcfd",
                    "BKG-223c0ebd-7c44-4b37-b509-bc338efe95d2", "BKG-a2531c0c-53c8-4040-b1cf-34f5bc1149dc",
                    "BKG-ecaee10a-91ef-43ac-b0ea-df583aa3bceb", "BKG-c84d1659-1464-4cdd-adbd-9d5df57b3757",
                    "BKG-3d84339f-218b-4640-9906-87805a5431d0"
            };

            for (int i = 1; i <= 17; i++) {
                TransactionHistory tx = new TransactionHistory();

                // 1. Tạo thời gian ngẫu nhiên (4 ngày gần nhất, từ 8h - 22h, giờ chẵn)
                int randomDaysAgo = random.nextInt(4); // 0 đến 3 ngày trước
                int randomHour = random.nextInt(15) + 8; // 8 đến 22 (8h sáng - 10h tối)

                LocalDateTime randomDateTime = LocalDateTime.now()
                        .minusDays(randomDaysAgo)
                        .withHour(randomHour)
                        .withMinute(0)
                        .withSecond(0)
                        .withNano(0);

                tx.setCreatedAt(randomDateTime);

                // 2. Cấu hình Status & Type
                TransactionStatus status = (i <= 2) ? TransactionStatus.FAILED : TransactionStatus.SUCCESS;
                TransactionType type = allowedTypes[random.nextInt(allowedTypes.length)];
                BigDecimal amount = new BigDecimal((random.nextInt(10) + 1) * 500000);
                String bookingRef = bookingCodes[random.nextInt(bookingCodes.length)];

                // 3. Logic chi tiết theo từng Type
                switch (type) {
                    case DEPOSIT:
                        tx.setSenderId(null);
                        tx.setSenderName("Hệ thống Ngân hàng");
                        tx.setReceiverId(1L);
                        tx.setReceiverName("Nguyễn Thành Nam");
                        tx.setDescription("Nạp " + df.format(amount) + " đ vào tài khoản thành công");
                        tx.setTransactionCode("DEP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                        tx.setPostBalanceReceiver(new BigDecimal("100000000.00"));
                        break;

                    case REFUND:
                        tx.setSenderId(null);
                        tx.setSenderName("Hệ thống");
                        if (random.nextBoolean()) {
                            tx.setReceiverId(1L);
                            tx.setReceiverName("Nguyễn Thành Nam");
                            tx.setDescription("Hệ thống hoàn trả cho hóa đơn " + bookingRef);
                        } else {
                            tx.setReceiverId(3L);
                            tx.setReceiverName("Lê Hoàng Phong");
                            tx.setDescription("Bạn nhận được " + df.format(amount) + " từ đơn thuê xe " + bookingRef);
                        }
                        tx.setTransactionCode("RFD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                        break;

                    case PAYMENT:
                        tx.setSenderId(1L);
                        tx.setSenderName("Nguyễn Thành Nam");
                        tx.setReceiverId(3L);
                        tx.setReceiverName("Lê Hoàng Phong");
                        tx.setDescription("Thanh toán cho đơn thuê xe " + bookingRef);
                        tx.setTransactionCode("PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                        break;
                }

                tx.setAmount(amount);
                tx.setStatus(status);
                tx.setType(type);
                transactions.add(tx);
            }

            transactionRepository.saveAll(transactions);
            log.info("✅ Hoàn tất khởi tạo 17 giao dịch mẫu với thời gian ngẫu nhiên!");
        }
    }
}
package com.swb.userservice.config;

import com.swb.userservice.entities.Role;
import com.swb.userservice.entities.User;
import com.swb.userservice.enums.ERole;
import com.swb.userservice.enums.UserStatus;
import com.swb.userservice.repositories.RoleRepository;
import com.swb.userservice.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        if (roleRepository.count() == 0) {
            log.info("🌱 Đang khởi tạo dữ liệu mẫu (Data Seeding) cho User...");

            // 1. Roles
            Role roleCustomer = roleRepository.save(new Role(null, ERole.ROLE_CUSTOMER));
            Role roleOwner = roleRepository.save(new Role(null, ERole.ROLE_OWNER));
            Role roleAdmin = roleRepository.save(new Role(null, ERole.ROLE_ADMIN));

            // Mật khẩu chung cho tất cả các user mẫu
            String commonPassword = passwordEncoder.encode("123456");

            // ==========================================
            // CÁC USER TRẠNG THÁI ACTIVE
            // ==========================================
            User customer1 = User.builder()
                    .email("customer1@gmail.com")
                    .passwordHash(commonPassword)
                    .fullName("Nguyễn Thành Nam")
                    .phoneNumber("0911111111")
                    .dateOfBirth(java.time.LocalDate.of(2000, 1, 1))
                    .walletBalance(new BigDecimal("100000000.00")) // 100 triệu đồng
                    .status(UserStatus.ACTIVE)
                    .roles(Set.of(roleCustomer))
                    .build();

            User customer2 = User.builder()
                    .email("minhthu@gmail.com")
                    .passwordHash(commonPassword)
                    .fullName("Trần Minh Thư")
                    .phoneNumber("0922222222")
                    .dateOfBirth(java.time.LocalDate.of(1995, 5, 15))
                    .walletBalance(new BigDecimal("5000000.00")) // 5 triệu đồng
                    .status(UserStatus.ACTIVE)
                    .roles(Set.of(roleCustomer))
                    .build();

            User owner = User.builder()
                    .email("owner@gmail.com")
                    .passwordHash(commonPassword)
                    .fullName("Lê Hoàng Phong")
                    .phoneNumber("0933333333")
                    .dateOfBirth(java.time.LocalDate.of(1990, 2, 28))
                    .walletBalance(new BigDecimal("15000000.00")) // 15 triệu đồng
                    .status(UserStatus.ACTIVE)
                    .roles(Set.of(roleOwner))
                    .build();

            User admin = User.builder()
                    .email("admin@gmail.com")
                    .passwordHash(commonPassword)
                    .fullName("Hệ Thống Quản Trị")
                    .phoneNumber("0944444444")
                    .dateOfBirth(java.time.LocalDate.of(1985, 12, 10))
                    .walletBalance(new BigDecimal("9889999.00"))
                    .status(UserStatus.ACTIVE)
                    .roles(Set.of(roleAdmin))
                    .build();

            // Vừa thuê xe vừa cho thuê xe
            User dualRoleUser = User.builder()
                    .email("pro@gmail.com")
                    .passwordHash(commonPassword)
                    .fullName("Phạm Quốc Anh")
                    .phoneNumber("0955555555")
                    .dateOfBirth(java.time.LocalDate.of(1992, 8, 8))
                    .walletBalance(new BigDecimal("20000000.00"))
                    .status(UserStatus.ACTIVE)
                    .roles(Set.of(roleCustomer, roleOwner))
                    .build();

            // ==========================================
            // CÁC TRẠNG THÁI TÀI KHOẢN KHÁC
            // ==========================================
            User inactiveUser = User.builder()
                    .email("thanhhai35@gmail.com")
                    .passwordHash(commonPassword)
                    .fullName("Đỗ Thanh Hải")
                    .phoneNumber("0966666666")
                    .walletBalance(BigDecimal.ZERO)
                    .status(UserStatus.INACTIVE)
                    .roles(Set.of(roleCustomer))
                    .build();

            User bannedUser = User.builder()
                    .email("trongnghia67@gmail.com")
                    .passwordHash(commonPassword)
                    .fullName("Hoàng Trọng Nghĩa")
                    .phoneNumber("0977777777")
                    .walletBalance(BigDecimal.ZERO)
                    .status(UserStatus.BANNED)
                    .roles(Set.of(roleCustomer))
                    .build();

            User pendingDeletionUser = User.builder()
                    .email("vuthanh@gmail.com")
                    .passwordHash(commonPassword)
                    .fullName("Vũ Thanh Huyền")
                    .phoneNumber("0988888888")
                    .walletBalance(BigDecimal.ZERO)
                    .status(UserStatus.PENDING_DELETION)
                    .roles(Set.of(roleCustomer))
                    .build();

            userRepository.saveAll(java.util.List.of(
                    customer1, customer2, owner, admin, dualRoleUser, inactiveUser, bannedUser, pendingDeletionUser
            ));

            log.info("✅ Khởi tạo thành công 8 user mẫu!");
        } else {
            log.info("Database đã có dữ liệu User, bỏ qua bước Seeding.");
        }
    }
}
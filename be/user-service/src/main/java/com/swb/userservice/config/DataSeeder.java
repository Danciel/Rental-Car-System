package com.swb.userservice.config;

import com.swb.userservice.entities.Role;
import com.swb.userservice.entities.User;
import com.swb.userservice.enums.ERole;
import com.swb.userservice.enums.UserStatus;
import com.swb.userservice.repositories.RoleRepository;
import com.swb.userservice.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        if (roleRepository.count() == 0) {
            System.out.println("🌱 Đang khởi tạo dữ liệu mẫu (Data Seeding)...");

            // 1. Roles
            Role roleCustomer = roleRepository.save(new Role(null, ERole.ROLE_CUSTOMER));
            Role roleOwner = roleRepository.save(new Role(null, ERole.ROLE_OWNER));
            Role roleAdmin = roleRepository.save(new Role(null, ERole.ROLE_ADMIN));

            // Mật khẩu chung cho tất cả các user mẫu
            String commonPassword = passwordEncoder.encode("123456");

            /*
            TODO: Tạo các user mẫu với các đặc điểm khác nhau để test:
            5 User ACTIVE với các role và trạng thái khác nhau:
            - 1 user CUSTOMER chưa xác thực bằng lái (isLicenseVerified = false)
            - 1 user CUSTOMER đã xác thực bằng lái (isLicenseVerified = true)
            - 1 user OWNER
            - 1 user ADMIN
            - 1 user vừa là CUSTOMER và OWNER

            1 user INACTIVE để test trường hợp tài khoản chưa hoàn tất đăng ký hoặc không xác thực email.

            1 user BANNED để test trường hợp tài khoản bị cấm truy cập do vi phạm chính sách. (Có thể dùng email hoặc hotline để liên hệ hỗ trợ)

            1 user PENDING_DELETION để test trường hợp tài khoản đang chờ xóa.
             */

            // 2. CUSTOMER 1 (Chưa xác thực bằng lái)
            User customerUnverified = User.builder()
                    .email("customer1@gmail.com")
                    .passwordHash(commonPassword)
                    .fullName("Nguyễn Khách Hàng (Chưa BLX)")
                    .phoneNumber("111111111")
                    .dateOfBirth(java.time.LocalDate.of(2000, 1, 1))
                    .walletBalance(new BigDecimal("1000000.00"))
                    .status(UserStatus.ACTIVE)
                    .isLicenseVerified(false)
                    .roles(Set.of(roleCustomer))
                    .build();
            userRepository.save(customerUnverified);

            // 3. CUSTOMER 2 (Đã xác thực bằng lái)
            User customerVerified = User.builder()
                    .email("customer2@gmail.com")
                    .passwordHash(commonPassword)
                    .fullName("Trần Khách Hàng (Đã BLX)")
                    .phoneNumber("222222222")
                    .dateOfBirth(java.time.LocalDate.of(1995, 5, 15))
                    .walletBalance(new BigDecimal("5000000.00"))
                    .status(UserStatus.ACTIVE)
                    .isLicenseVerified(true)
                    .roles(Set.of(roleCustomer))
                    .build();
            userRepository.save(customerVerified);

            // 4. OWNER
            User owner = User.builder()
                    .email("owner@gmail.com")
                    .passwordHash(commonPassword)
                    .fullName("Chủ Xe")
                    .phoneNumber("333333333")
                    .dateOfBirth(java.time.LocalDate.of(1990, 2, 28))
                    .walletBalance(new BigDecimal("15000000.00"))
                    .status(UserStatus.ACTIVE)
                    .isLicenseVerified(true)
                    .roles(Set.of(roleOwner))
                    .build();
            userRepository.save(owner);

            // 5. ADMIN
            User admin = User.builder()
                    .email("admin@gmail.com")
                    .passwordHash(commonPassword)
                    .fullName("Quản Trị")
                    .phoneNumber("444444444")
                    .dateOfBirth(java.time.LocalDate.of(1985, 12, 10))
                    .walletBalance(new BigDecimal("99999999.00"))
                    .status(UserStatus.ACTIVE)
                    .isLicenseVerified(true)
                    .roles(Set.of(roleAdmin))
                    .build();
            userRepository.save(admin);

            System.out.println("✅ Khởi tạo dữ liệu mẫu thành công!");
        } else {
            System.out.println("Database đã có dữ liệu, bỏ qua bước Seeding.");
        }
    }
}

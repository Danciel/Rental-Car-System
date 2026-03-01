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
public class DataSeeder implements CommandLineRunner{
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

            // 2. CUSTOMER 1 (Chưa xác thực bằng lái)
            User customerUnverified = User.builder()
                    .email("customer1@gmail.com")
                    .passwordHash(commonPassword)
                    .fullName("Nguyễn Khách Hàng (Chưa BLX)")
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

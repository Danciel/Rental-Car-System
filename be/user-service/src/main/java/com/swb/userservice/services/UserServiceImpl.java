package com.swb.userservice.services;

import com.swb.common.exception.AppException;
import com.swb.userservice.dtos.request.ChangePasswordRequest;
import com.swb.userservice.dtos.request.LoginRequest;
import com.swb.userservice.dtos.response.LoginResponse;
import com.swb.userservice.dtos.request.UpdateProfileRequest;
import com.swb.userservice.entities.Role;
import com.swb.userservice.entities.User;
import com.swb.userservice.dtos.response.RegisterRequest;
import com.swb.userservice.dtos.response.UserProfileResponse;
import com.swb.userservice.enums.ERole;
import com.swb.userservice.enums.UserStatus;
import com.swb.userservice.repositories.RoleRepository;
import com.swb.userservice.repositories.UserRepository;

import com.swb.userservice.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional(readOnly = true)
    public java.util.List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserProfileResponse registerUser(RegisterRequest request) {
        log.info("Bắt đầu xử lý đăng ký cho email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Email đã được sử dụng trong hệ thống.");
        }

        Role customerRole = roleRepository.findByName(ERole.ROLE_CUSTOMER)
                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "Lỗi hệ thống: Không tìm thấy Role."));
        Set<Role> roles = new HashSet<>();
        roles.add(customerRole);

        User newUser = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .walletBalance(BigDecimal.ZERO)
                .status(UserStatus.INACTIVE)
                .roles(roles)
                .build();

        User savedUser = userRepository.save(newUser);
        log.info("Đăng ký thành công user id: {}", savedUser.getId());

        return mapToResponse(savedUser);
    }

    @Override
    public LoginResponse loginUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "Email hoặc mật khẩu không chính xác"));

        boolean isPasswordMatch = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
        if (!isPasswordMatch) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Email hoặc mật khẩu không chính xác");
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new AppException(HttpStatus.FORBIDDEN, "Tài khoản của bạn đã bị khóa hoặc chưa kích hoạt");
        }

        String token = jwtTokenProvider.generateToken(user);

        UserProfileResponse userProfile = UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .walletBalance(user.getWalletBalance())
                .status(user.getStatus().name())
                .roles(user.getRoles().stream().map(role -> role.getName().name()).collect(Collectors.toSet()))
                .build();

        return LoginResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getExpirationMs() / 1000)
                .user(userProfile)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "Không tìm thấy người dùng."));
        return mapToResponse(user);
    }

    @Override
    public UserProfileResponse getMyProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy thông tin người dùng"));

        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .dateOfBirth(user.getDateOfBirth())
                .avatarUrl(user.getAvatarUrl())
                .walletBalance(user.getWalletBalance())
                .status(user.getStatus().name())
                .roles(user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(java.util.stream.Collectors.toSet()))
                .build();
    }

    @Override
    @Transactional
    public UserProfileResponse updateMyProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));

        user.setFullName(request.getFullName());
        if (request.getPhone() != null) {
            user.setPhoneNumber(request.getPhone());
        }

        if (request.getDateOfBirth() != null) {
            user.setDateOfBirth(request.getDateOfBirth());
        }

        userRepository.save(user);

        return getMyProfile(email);
    }

    @Override
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Mật khẩu cũ không chính xác");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void requestAccountDeletion(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));

        if (user.getStatus() == UserStatus.BANNED) {
            throw new AppException(HttpStatus.FORBIDDEN, "Tài khoản đang bị khóa, không thể thực hiện thao tác này");
        }

        user.setStatus(UserStatus.PENDING_DELETION);
        user.setDeletionRequestedAt(LocalDateTime.now());

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void verifyEmail(String token) {
        // Giả sử bạn lưu token trong DB hoặc giải mã token JWT
        // Ở đây viết logic tìm user theo token (Ví dụ minh họa)
//        User user = userRepository.findByVerificationToken(token)
//                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "Token không hợp lệ hoặc đã hết hạn"));

//        user.setStatus(UserStatus.ACTIVE);
        // user.setVerificationToken(null); // Xóa token sau khi dùng xong
    return;
//        userRepository.save(user);
    }

    private UserProfileResponse mapToResponse(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());

        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .dateOfBirth(user.getDateOfBirth())
                .avatarUrl(user.getAvatarUrl())
                .walletBalance(user.getWalletBalance())
                .status(user.getStatus().name())
                .roles(roleNames)
                .build();
    }
}

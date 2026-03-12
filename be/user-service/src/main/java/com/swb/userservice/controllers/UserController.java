package com.swb.userservice.controllers;

import com.swb.common.dtos.ApiResponse;
import com.swb.userservice.dtos.request.ChangePasswordRequest;
import com.swb.userservice.dtos.request.LoginRequest;
import com.swb.userservice.dtos.response.LoginResponse;
import com.swb.userservice.dtos.response.RegisterRequest;
import com.swb.userservice.dtos.response.UserProfileResponse;
import com.swb.userservice.dtos.request.UpdateProfileRequest;
import com.swb.userservice.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllUsers() {
        List<UserProfileResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users, "Lấy danh sách người dùng thành công"));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserProfileResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        UserProfileResponse responseData = userService.registerUser(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(responseData, "Đăng ký tài khoản thành công!"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse responseData = userService.loginUser(request);

        return ResponseEntity
                .ok(ApiResponse.success(responseData, "Đăng nhập thành công!"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getMyProfile(
            @RequestHeader("X-User-Email") String email) {

        UserProfileResponse myProfile = userService.getMyProfile(email);

        return ResponseEntity.ok(ApiResponse.success(myProfile, "Lấy thông tin cá nhân thành công"));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateMyProfile(
            @RequestHeader("X-User-Email") String email,
            @Valid @RequestBody UpdateProfileRequest request) {

        UserProfileResponse updatedProfile = userService.updateMyProfile(email, request);
        return ResponseEntity.ok(ApiResponse.success(updatedProfile, "Cập nhật thông tin thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getUserProfile(@PathVariable Long id) {
        UserProfileResponse responseData = userService.getUserProfile(id);

        return ResponseEntity
                .ok(ApiResponse.success(responseData, "Lấy thông tin thành công"));
    }

    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @RequestHeader("X-User-Email") String email,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(email, request);
        return ResponseEntity.ok(ApiResponse.success(null, "Đổi mật khẩu thành công"));
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> requestAccountDeletion(
            @RequestHeader("X-User-Email") String email) {
        userService.requestAccountDeletion(email);
        return ResponseEntity.ok(ApiResponse.success(null, "Yêu cầu xóa tài khoản đã được ghi nhận"));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestParam("token") String token) {
        userService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.success(null, "Xác thực email thành công. Tài khoản đã được kích hoạt."));
    }

    @PostMapping("/me/resend-verification")
    public ResponseEntity<ApiResponse<Void>> resendVerificationEmail(
            @RequestHeader("X-User-Email") String email) {
        userService.resendVerificationEmail(email);
        return ResponseEntity.ok(ApiResponse.success(null, "Email xác thực đã được gửi lại. Vui lòng kiểm tra hòm thư."));
    }
}
package com.swb.userservice.controllers;

import com.swb.common.dtos.ApiResponse;
import com.swb.userservice.dtos.LoginRequest;
import com.swb.userservice.dtos.LoginResponse;
import com.swb.userservice.dtos.RegisterRequest;
import com.swb.userservice.dtos.UserProfileResponse;
import com.swb.userservice.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

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
    public ResponseEntity<String> getMyProfile() {
        return ResponseEntity.ok("Lấy thông tin thành công");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getUserProfile(@PathVariable Long id) {
        UserProfileResponse responseData = userService.getUserProfile(id);

        return ResponseEntity
                .ok(ApiResponse.success(responseData, "Lấy thông tin thành công"));
    }
}
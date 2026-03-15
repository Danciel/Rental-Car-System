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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllUsers() {
        List<UserProfileResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users, "Successfully retrieved the list of users\n"));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserProfileResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        UserProfileResponse responseData = userService.registerUser(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(responseData, "Account registered successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse responseData = userService.loginUser(request);

        return ResponseEntity
                .ok(ApiResponse.success(responseData, "Login successful!"));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_CUSTOMER', 'ROLE_OWNER', 'ROLE_ADMIN')")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getMyProfile(
            @RequestHeader("X-User-Email") String email) {

        UserProfileResponse myProfile = userService.getMyProfile(email);

        return ResponseEntity.ok(ApiResponse.success(myProfile, "Successfully retrieved personal information"));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_CUSTOMER', 'ROLE_OWNER', 'ROLE_ADMIN')")
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateMyProfile(
            @RequestHeader("X-User-Email") String email,
            @Valid @RequestBody UpdateProfileRequest request) {

        UserProfileResponse updatedProfile = userService.updateMyProfile(email, request);
        return ResponseEntity.ok(ApiResponse.success(updatedProfile, "Profile updated successfully"));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getUserProfile(@PathVariable Long id) {
        UserProfileResponse responseData = userService.getUserProfile(id);

        return ResponseEntity
                .ok(ApiResponse.success(responseData, "Successfully retrieved user information"));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_CUSTOMER', 'ROLE_OWNER', 'ROLE_ADMIN')")
    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @RequestHeader("X-User-Email") String email,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(email, request);
        return ResponseEntity.ok(ApiResponse.success(null, "Password changed successfully"));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_CUSTOMER', 'ROLE_OWNER', 'ROLE_ADMIN')")
    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> requestAccountDeletion(
            @RequestHeader("X-User-Email") String email) {
        userService.requestAccountDeletion(email);
        return ResponseEntity.ok(ApiResponse.success(null, "Account deletion request has been recorded"));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestParam("token") String token) {
        userService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.success(null, "Email verified successfully. Your account is now activated."));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_CUSTOMER', 'ROLE_OWNER', 'ROLE_ADMIN')")
    @PostMapping("/me/resend-verification")
    public ResponseEntity<ApiResponse<Void>> resendVerificationEmail(
            @RequestHeader("X-User-Email") String email) {
        userService.resendVerificationEmail(email);
        return ResponseEntity.ok(ApiResponse.success(null, "Verification email has been resent. Please check your inbox."));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{userId}/wallet")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateWallet(
            @PathVariable Long userId,
            @RequestParam BigDecimal amount) {
        UserProfileResponse responseData = userService.updateWalletBalance(userId, amount);
        return ResponseEntity.ok(ApiResponse.success(responseData, "Wallet balance updated successfully"));
    }
}
package com.swb.userservice.services;

import com.swb.userservice.dtos.request.ChangePasswordRequest;
import com.swb.userservice.dtos.request.LoginRequest;
import com.swb.userservice.dtos.response.LoginResponse;
import com.swb.userservice.dtos.response.RegisterRequest;
import com.swb.userservice.dtos.response.UserProfileResponse;
import com.swb.userservice.dtos.request.UpdateProfileRequest;

import java.util.List;

public interface UserService {
    List<UserProfileResponse> getAllUsers();

    UserProfileResponse registerUser(RegisterRequest request);

    LoginResponse loginUser(LoginRequest request);

    UserProfileResponse getUserProfile(Long userId);

    UserProfileResponse getMyProfile(String email);

    UserProfileResponse updateMyProfile(String email, UpdateProfileRequest request);

    void changePassword(String email, ChangePasswordRequest request);

    void requestAccountDeletion(String email);

    void verifyEmail(String token);

    void resendVerificationEmail(String email);
}
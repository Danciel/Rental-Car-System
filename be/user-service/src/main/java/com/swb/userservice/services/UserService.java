package com.swb.userservice.services;

import com.swb.userservice.dtos.LoginRequest;
import com.swb.userservice.dtos.LoginResponse;
import com.swb.userservice.dtos.RegisterRequest;
import com.swb.userservice.dtos.UserProfileResponse;
import com.swb.userservice.dtos.request.UpdateProfileRequest;

import java.util.List;

public interface UserService {
    List<UserProfileResponse> getAllUsers();

    UserProfileResponse registerUser(RegisterRequest request);

    LoginResponse loginUser(LoginRequest request);

    UserProfileResponse getUserProfile(Long userId);

    UserProfileResponse getMyProfile(String email);

    UserProfileResponse updateMyProfile(String email, UpdateProfileRequest request);
}
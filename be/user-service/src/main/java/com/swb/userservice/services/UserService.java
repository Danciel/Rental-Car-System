package com.swb.userservice.services;

import com.swb.userservice.dtos.LoginRequest;
import com.swb.userservice.dtos.LoginResponse;
import com.swb.userservice.dtos.RegisterRequest;
import com.swb.userservice.dtos.UserProfileResponse;

public interface UserService {
    UserProfileResponse registerUser(RegisterRequest request);

    LoginResponse loginUser(LoginRequest request);

    UserProfileResponse getUserProfile(Long userId);
}
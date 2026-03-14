package com.swb.userservice.services;

public interface EmailService {
    void sendVerificationEmail(String toEmail, String token);
}

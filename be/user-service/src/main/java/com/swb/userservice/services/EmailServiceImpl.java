package com.swb.userservice.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    @Async
    public void sendVerificationEmail(String toEmail, String token) {
        String verificationLink = "http://localhost:5173/verify-email?token=" + token;

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Xác thực tài khoản AutoShare của bạn");

            // Tạo nội dung HTML với CSS Inline
            String htmlContent = buildEmailTemplate(verificationLink);

            helper.setText(htmlContent, true); // true để xác nhận đây là HTML

            mailSender.send(message);
        } catch (MessagingException e) {
            log.error("Failed to send email", e);
            throw new RuntimeException("Email sending failed");
        }
    }

    private String buildEmailTemplate(String link) {
        return "<div style=\"font-family: 'Inter', sans-serif; background-color: #F8FAFC; padding: 40px; color: #1E293B;\">" +
                "  <div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);\">" +
                "    <div style=\"background-color: #1E40AF; padding: 30px; text-align: center;\">" +
                "      <h1 style=\"color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;\">AutoShare</h1>" +
                "    </div>" +
                "    <div style=\"padding: 40px; line-height: 1.6;\">" +
                "      <h2 style=\"color: #1E293B; margin-top: 0;\">Chào mừng bạn đến với AutoShare!</h2>" +
                "      <p>Cảm ơn bạn đã đăng ký. Để bắt đầu hành trình thuê xe hoặc cho thuê xe, vui lòng xác thực địa chỉ email của bạn bằng cách nhấn vào nút bên dưới:</p>" +
                "      <div style=\"text-align: center; margin: 30px 0;\">" +
                "        <a href=\"" + link + "\" style=\"background-color: #1E40AF; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;\">Xác thực tài khoản</a>" +
                "      </div>" +
                "      <p style=\"font-size: 14px; color: #64748B;\">Nếu nút trên không hoạt động, bạn có thể copy link này vào trình duyệt: <br>" +
                "      <a href=\"" + link + "\" style=\"color: #1E40AF;\">" + link + "</a></p>" +
                "      <hr style=\"border: 0; border-top: 1px solid #E2E8F0; margin: 30px 0;\">" +
                "      <p style=\"font-size: 12px; color: #94A3B8; text-align: center;\">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.<br>© 2026 AutoShare Vietnam. All rights reserved.</p>" +
                "    </div>" +
                "  </div>" +
                "</div>";
    }
}
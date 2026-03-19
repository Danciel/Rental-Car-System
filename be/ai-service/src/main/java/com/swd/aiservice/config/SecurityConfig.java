package com.swd.aiservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. Tắt CSRF (Bắt buộc khi làm API RESTful)
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Kích hoạt CORS để Frontend React gọi không bị lỗi
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 3. Cấu hình phân quyền HTTP Requests
                .authorizeHttpRequests(auth -> auth
                        // 🔓 MỞ PUBLIC toàn bộ các API bắt đầu bằng /api/ai/
                        .requestMatchers("/api/ai/**").permitAll()

                        // Các API khác (nếu có) thì bắt buộc phải đăng nhập
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    // Cấu hình CORS mở rộng cho phép React (localhost:5173) gọi thoải mái
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*")); // Hoặc thay bằng "http://localhost:5173"
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
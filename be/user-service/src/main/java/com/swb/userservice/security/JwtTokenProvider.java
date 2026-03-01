package com.swb.userservice.security;

import com.swb.userservice.entities.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {
    // Chỉ để test, phải cấu hình trong application.yml và env
    private final String jwtSecret = "D385038A6A8104ECB277329E4D4A47E84B1E976690B7586BA01A1E574B2A88BD";

    private final long jwtExpirationMs = 1800000; // 30 minutes

    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        String roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.joining(","));

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("id", user.getId())
                .claim("roles", roles)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key())
                .compact();
    }

    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public long getExpirationMs() {
        return jwtExpirationMs;
    }

    public String getEmailFromJWT(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().verifyWith(key()).build().parseSignedClaims(authToken);
            return true;
        } catch (Exception ex) {
            System.out.println("Token không hợp lệ: " + ex.getMessage());
            return false;
        }
    }
}
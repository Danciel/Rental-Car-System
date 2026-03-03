package com.swb.gatewayservice.util;

import com.swb.gatewayservice.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class AuthenticationFilter implements GlobalFilter, Ordered {

    private final JwtUtil jwtUtil;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        // Public endpoints: không cần token, bỏ qua filter
        String path = request.getURI().getPath();
        String method = request.getMethod().name();

        boolean isPublicPath = path.contains("/login") ||
                path.contains("/register") ||
                // Cho phép bất kỳ ai xem danh sách xe bằng lệnh GET
                (path.startsWith("/api/cars") && method.equals("GET")) ||
                (path.startsWith("/api/car-brands") && method.equals("GET")) ||
                (path.startsWith("/api/car-types") && method.equals("GET")) ||
                (path.startsWith("/api/car-models") && method.equals("GET"));

        if (isPublicPath) {
            return chain.filter(exchange);
        }
        java.util.List<String> authHeaders = request.getHeaders().get(HttpHeaders.AUTHORIZATION);
        if (authHeaders == null || authHeaders.isEmpty()) {
            return onError(exchange, HttpStatus.UNAUTHORIZED);
        }
        String authHeader = authHeaders.get(0);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            authHeader = authHeader.substring(7);
        } else {
            return onError(exchange, HttpStatus.UNAUTHORIZED);
        }


        try {
            jwtUtil.validateToken(authHeader);
            String email = jwtUtil.getEmailFromToken(authHeader);
            ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                    .header("X-User-Email", email)
                    .build();

            return chain.filter(exchange.mutate().request(mutatedRequest).build());
        } catch (Exception e) {
            System.out.println("Token không hợp lệ: " + e.getMessage());
            return onError(exchange, HttpStatus.UNAUTHORIZED);
        }
    }

    // Hàm này sẽ trả về lỗi và dừng filter chain nếu token không hợp lệ
    private Mono<Void> onError(ServerWebExchange exchange, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        return response.setComplete();
    }

    // Đảm bảo filter này chạy trước các filter khác
    @Override
    public int getOrder() {
        return -1;
    }
}

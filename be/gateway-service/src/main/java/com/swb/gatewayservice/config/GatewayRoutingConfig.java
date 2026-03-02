package com.swb.gatewayservice.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutingConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // User Service
                .route("user-service", r -> r
                        .path("/api/users/**")
                        .uri("http://localhost:8081"))

                // TODO:
                //  Car Service
                // .route("car-service", r -> r
                //         .path("/api/cars/**")
                //         .uri("http://localhost:8082"))

                .build();
    }
}
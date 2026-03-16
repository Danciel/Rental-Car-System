package com.swd.reportservice.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "service")
public class ServiceUrlsProperties {
    private ServiceUrl user = new ServiceUrl();
    private ServiceUrl car = new ServiceUrl();
    private ServiceUrl booking = new ServiceUrl();
    private ServiceUrl payment = new ServiceUrl();

    @Getter
    @Setter
    public static class ServiceUrl {
        private String url;
    }
}


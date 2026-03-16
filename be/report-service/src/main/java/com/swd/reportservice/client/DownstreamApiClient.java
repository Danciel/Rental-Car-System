package com.swd.reportservice.client;

import com.swd.reportservice.config.ServiceUrlsProperties;
import com.swd.reportservice.util.SecurityContextUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DownstreamApiClient {

    private final ServiceUrlsProperties serviceUrls;

    public <T> T getBookingsManage(Class<T> bodyType) {
        String url = serviceUrls.getBooking().getUrl() + "/api/bookings/manage";
        return restClientForCurrentUser()
                .get()
                .uri(url)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(bodyType);
    }

    public <T> T getAllTransactions(Class<T> bodyType, String queryString) {
        String url = serviceUrls.getPayment().getUrl() + "/api/payments/history/all" + (queryString == null ? "" : queryString);
        return restClientForCurrentUser()
                .get()
                .uri(url)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(bodyType);
    }

    public <T> T getCars(Class<T> bodyType, String queryString) {
        String url = serviceUrls.getCar().getUrl() + "/api/cars" + (queryString == null ? "" : queryString);
        return restClientForCurrentUser()
                .get()
                .uri(url)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(bodyType);
    }

    public <T> T getUsers(Class<T> bodyType) {
        String url = serviceUrls.getUser().getUrl() + "/api/users";
        return restClientForCurrentUser()
                .get()
                .uri(url)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(bodyType);
    }

    private RestClient restClientForCurrentUser() {
        String email = SecurityContextUtil.currentEmailOrUnknown();
        List<String> roles = SecurityContextUtil.currentRoles();
        String rolesHeader = String.join(",", roles);

        return RestClient.builder()
                .defaultHeader("X-User-Email", email)
                .defaultHeader("X-User-Roles", rolesHeader)
                .build();
    }
}


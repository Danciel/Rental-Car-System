package com.swd.paymentservice.entities;

import com.swd.paymentservice.enums.PaymentMethod;
import com.swd.paymentservice.services.PaymentGateway;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Component
public class PaymentGatewayRegistry {

    private final Map<PaymentMethod, PaymentGateway> map = new EnumMap<>(PaymentMethod.class);

    public PaymentGatewayRegistry(List<PaymentGateway> gateways) {
        for (var g : gateways) map.put(g.method(), g);
    }

    public PaymentGateway get(PaymentMethod method) {
        PaymentGateway g = map.get(method);
        if (g == null) throw new IllegalArgumentException("Unsupported payment method: " + method);
        return g;
    }
}

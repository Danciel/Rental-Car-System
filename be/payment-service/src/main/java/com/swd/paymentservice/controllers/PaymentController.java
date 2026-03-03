package com.swd.paymentservice.controllers;

import com.swd.paymentservice.dtos.ApiResponse;
import com.swd.paymentservice.dtos.PaymentRequest;
import com.swd.paymentservice.dtos.PaymentResponse;
import com.swd.paymentservice.enums.PaymentMethod;
import com.swd.paymentservice.services.IPaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final IPaymentService paymentService;

    @PostMapping("/init")
    public ResponseEntity<ApiResponse<PaymentResponse>> init(@Valid @RequestBody PaymentRequest request,
                                                             HttpServletRequest http) {
        String clientIp = resolveClientIp(http);
        PaymentResponse data = paymentService.initPayment(request, clientIp);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(data, "Khởi tạo thanh toán thành công"));
    }

    // callback chung cho ONLINE (VNPAY/MOMO) -> linh hoạt cho PayPal/Bank sau này
    @RequestMapping(value = "/callback/{method}", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<ApiResponse<Void>> callback(@PathVariable PaymentMethod method,
                                                      @RequestParam Map<String, String> params) {
        paymentService.handleCallback(method, params);
        return ResponseEntity.ok(ApiResponse.success(null, "Nhận kết quả thanh toán thành công"));
    }

    // xác nhận tiền mặt (admin/owner)
    @PutMapping("/{paymentId}/cash/confirm")
    public ResponseEntity<ApiResponse<Void>> confirmCash(@PathVariable Long paymentId) {
        paymentService.confirmCashPaid(paymentId);
        return ResponseEntity.ok(ApiResponse.success(null, "Xác nhận thanh toán tiền mặt thành công"));
    }

    private String resolveClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) return xff.split(",")[0].trim();
        return request.getRemoteAddr();
    }
}
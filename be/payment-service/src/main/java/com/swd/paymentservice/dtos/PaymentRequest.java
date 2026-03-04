package com.swd.paymentservice.dtos;

import com.swd.paymentservice.enums.PaymentMethod;
import com.swd.paymentservice.enums.PaymentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PaymentRequest {

    @NotBlank(message = "Mã đặt xe không được để trống")
    private String bookingNo;

    @NotNull(message = "Phương thức thanh toán không được để trống")
    private PaymentMethod method;

    // THÊM DÒNG NÀY: Bắt buộc truyền loại thanh toán
    @NotNull(message = "Loại thanh toán không được để trống")
    private PaymentType type;

    // (Tùy chọn) Nếu hệ thống của bạn yêu cầu nhận số tiền từ Frontend:
    private BigDecimal amount;
}
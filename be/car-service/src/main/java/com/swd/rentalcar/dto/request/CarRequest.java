package com.swd.rentalcar.dto.request;

import com.swd.rentalcar.entity.enums.CarStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CarRequest {

    @NotBlank(message = "Biển số xe không được để trống")
    private String licensePlate;

    @NotNull(message = "Giá thuê theo ngày không được để trống")
    private BigDecimal basePricePerDay;

    private BigDecimal depositAmount;

    @NotNull(message = "Mã mẫu xe không được để trống")
    private Long carModelId;

    private List<CarImageRequest> images;
}

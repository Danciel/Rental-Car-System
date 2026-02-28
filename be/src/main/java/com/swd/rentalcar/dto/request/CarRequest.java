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

    @NotBlank(message = "License plate is required")
    private String licensePlate;

    @NotNull(message = "Base price per day is required")
    private BigDecimal basePricePerDay;

    private BigDecimal depositAmount;

    private CarStatus status;

    @NotNull(message = "Car model ID is required")
    private Long carModelId;

    private List<CarImageRequest> images;
}

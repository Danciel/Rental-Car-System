package com.swd.rentalcar.dto.request;


import com.swd.rentalcar.entity.enums.FuelType;
import com.swd.rentalcar.entity.enums.TransmissionType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class CarModelRequest {
    @NotBlank(message = "Tên mẫu xe không được để trống")
    private String name;

    private String description;

    @NotNull(message = "Năm sản xuất không được để trống")
    private Integer year;

    @NotNull(message = "Loại nhiên liệu không được để trống")
    private FuelType fuelType;

    private BigDecimal fuelCapacity;

    private BigDecimal batteryCapacity;

    @NotNull(message = "Hộp số không được để trống")
    private TransmissionType transmission;

    @NotNull(message = "Số ghế không được để trống")
    @Min(value = 1, message = "Số ghế phải lớn hơn hoặc bằng 1")
    private Integer seats;

    @NotNull(message = "Mã thương hiệu không được để trống")
    private Long brandId;

    @NotNull(message = "Mã loại xe không được để trống")
    private Long typeId;
}


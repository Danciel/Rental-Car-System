package com.swd.rentalcar.dto.request;


import com.swd.rentalcar.entity.enums.FuelType;
import com.swd.rentalcar.entity.enums.TransmissionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class CarModelRequest {
    @NotBlank(message = "Model name is required")
    private String name;

    private String description;

    @NotNull(message = "Year is required")
    private Integer year;

    @NotNull(message = "Fuel type is required")
    private FuelType fuelType;

    private BigDecimal fuelCapacity;

    private BigDecimal batteryCapacity;

    @NotNull(message = "Transmission is required")
    private TransmissionType transmission;

    @NotNull(message = "Seats count is required")
    @Min(value = 1, message = "Seats must be at least 1")
    private Integer seats;

    @NotNull(message = "Brand ID is required")
    private Long brandId;

    @NotNull(message = "Type ID is required")
    private Long typeId;
}


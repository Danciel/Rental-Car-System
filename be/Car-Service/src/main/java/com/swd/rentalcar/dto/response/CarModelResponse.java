package com.swd.rentalcar.dto.response;

import com.swd.rentalcar.entity.enums.ApprovalStatus;
import com.swd.rentalcar.entity.enums.FuelType;
import com.swd.rentalcar.entity.enums.TransmissionType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class CarModelResponse {

    private Long id;
    private String name;
    private String description;
    private ApprovalStatus approvalStatus;
    private Integer year;
    private FuelType fuelType;
    private BigDecimal fuelCapacity;
    private BigDecimal batteryCapacity;
    private String capacityDisplay;       // e.g. "60L" or "75 kWh" or "50L / 10 kWh"
    private TransmissionType transmission;
    private Integer seats;
    private Long brandId;
    private String brandName;
    private Long typeId;
    private String typeName;
}
package com.swd.rentalcar.dto.response;

import com.swd.rentalcar.entity.enums.CarStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CarResponse {
    private Long id;
    private String licensePlate;
    private BigDecimal basePricePerDay;
    private BigDecimal depositAmount;
    private CarStatus status;
    private CarModelResponse carModelId;
    private List<CarImageResponse> images;
}

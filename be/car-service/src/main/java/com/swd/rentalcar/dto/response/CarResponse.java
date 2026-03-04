package com.swd.rentalcar.dto.response;

import com.swd.rentalcar.entity.enums.CarStatus;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarResponse {
    private Long id;
    private String licensePlate;
    private BigDecimal basePricePerDay;
    private BigDecimal depositAmount;
    private CarStatus status;
    private CarModelResponse carModelId;
    private List<CarImageResponse> images;
    private Long ownerId;
    private Long brandId;
    private String brandName;
}

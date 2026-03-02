package com.swd.rentalcar.dto.request;

import com.swd.rentalcar.entity.enums.ApprovalStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CarBrandRequest {
    @NotBlank(message = "Tên thương hiệu không được để trống")
    private String name;

    private String logoUrl;

    private ApprovalStatus approvalStatus;
}

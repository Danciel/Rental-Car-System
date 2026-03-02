package com.swd.rentalcar.dto.response;

import com.swd.rentalcar.entity.enums.ApprovalStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CarBrandResponse {
    private Long id;
    private String name;
    private String logoUrl;
    private ApprovalStatus approvalStatus;
}

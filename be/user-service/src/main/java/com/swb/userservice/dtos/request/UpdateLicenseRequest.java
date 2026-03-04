package com.swb.userservice.dtos.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateLicenseRequest {
    @NotBlank(message = "Số giấy phép lái xe không được để trống")
    private String licenseNumber;

    @NotBlank(message = "Ảnh mặt trước không được để trống")
    private String frontImageUrl;

    @NotBlank(message = "Ảnh mặt sau không được để trống")
    private String backImageUrl;
}
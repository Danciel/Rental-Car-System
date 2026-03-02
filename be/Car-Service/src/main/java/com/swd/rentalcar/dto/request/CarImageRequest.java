package com.swd.rentalcar.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CarImageRequest {
    @NotBlank(message = "Đường dẫn hình ảnh không được để trống")
    private String imageUrl;

    @NotNull(message = "Trường isThumbnail không được để trống")
    private Boolean isThumbnail;
}

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
    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    @NotNull(message = "isThumbnail flag is required")
    private Boolean isThumbnail;
}

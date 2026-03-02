package com.swd.rentalcar.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CarImageResponse {

    private Long id;
    private String imageUrl;
    private Boolean isThumbnail;
    private Long carId;
}


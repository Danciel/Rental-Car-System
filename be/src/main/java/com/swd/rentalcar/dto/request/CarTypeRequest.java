package com.swd.rentalcar.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CarTypeRequest {
    @NotBlank(message = "Type name is required")
    private String typeName;

}

package com.swd.reportservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class ReportPreviewRequest {
    @NotBlank
    private String type;

    private Map<String, Object> filters;
}


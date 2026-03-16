package com.swd.reportservice.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ReportOptionDto {
    private String type;
    private String label;
    private List<ReportFilterFieldDto> filters;
}


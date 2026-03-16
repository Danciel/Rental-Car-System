package com.swd.reportservice.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ReportFilterFieldDto {
    private String key;
    private String label;
    private String type; // enum | text | date
    private boolean required;
    private List<String> options;
}


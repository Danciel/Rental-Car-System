package com.swd.reportservice.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ReportPreviewResponse {
    private Long reportId;
    private String type;
    private List<String> columns;
    private List<List<Object>> rows;
}


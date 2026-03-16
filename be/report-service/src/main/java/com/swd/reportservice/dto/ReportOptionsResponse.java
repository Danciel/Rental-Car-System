package com.swd.reportservice.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ReportOptionsResponse {
    private List<ReportOptionDto> options;
}


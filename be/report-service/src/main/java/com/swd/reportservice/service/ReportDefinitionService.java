package com.swd.reportservice.service;

import com.swd.reportservice.domain.ReportType;
import com.swd.reportservice.dto.ReportFilterFieldDto;
import com.swd.reportservice.dto.ReportOptionDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportDefinitionService {

    public List<ReportOptionDto> getOptions() {
        return List.of(
                ReportOptionDto.builder()
                        .type(ReportType.CAR_LIST.name())
                        .label("Car List")
                        .filters(List.of(
                                ReportFilterFieldDto.builder()
                                        .key("status")
                                        .label("Car status")
                                        .type("enum")
                                        .required(false)
                                        .options(List.of("AVAILABLE", "RENTED", "MAINTENANCE", "UNAVAILABLE"))
                                        .build()
                        ))
                        .build(),
                ReportOptionDto.builder()
                        .type(ReportType.USER_LIST.name())
                        .label("User List")
                        .filters(List.of())
                        .build()
                ,
                ReportOptionDto.builder()
                        .type(ReportType.REVENUE_REPORT.name())
                        .label("Revenue Report")
                        .filters(List.of(
                                ReportFilterFieldDto.builder()
                                        .key("dateFrom")
                                        .label("From date")
                                        .type("date")
                                        .required(false)
                                        .build(),
                                ReportFilterFieldDto.builder()
                                        .key("dateTo")
                                        .label("To date")
                                        .type("date")
                                        .required(false)
                                        .build()
                        ))
                        .build(),
                ReportOptionDto.builder()
                        .type(ReportType.POPULAR_CAR_REPORT.name())
                        .label("Popular Car Report")
                        .filters(List.of(
                                ReportFilterFieldDto.builder()
                                        .key("dateFrom")
                                        .label("From date")
                                        .type("date")
                                        .required(false)
                                        .build(),
                                ReportFilterFieldDto.builder()
                                        .key("dateTo")
                                        .label("To date")
                                        .type("date")
                                        .required(false)
                                        .build(),
                                ReportFilterFieldDto.builder()
                                        .key("topN")
                                        .label("Top N cars")
                                        .type("text")
                                        .required(false)
                                        .build()
                        ))
                        .build()
        );
    }
}


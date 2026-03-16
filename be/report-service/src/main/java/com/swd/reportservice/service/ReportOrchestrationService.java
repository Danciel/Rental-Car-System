package com.swd.reportservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.swd.reportservice.domain.ReportFormat;
import com.swd.reportservice.domain.ReportType;
import com.swd.reportservice.dto.ReportPreviewRequest;
import com.swd.reportservice.dto.ReportPreviewResponse;
import com.swd.reportservice.entity.GeneratedReport;
import com.swd.reportservice.repository.GeneratedReportRepository;
import com.swd.reportservice.util.SecurityContextUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportOrchestrationService {

    private final ReportDataService reportDataService;
    private final ReportExportService reportExportService;
    private final GeneratedReportRepository generatedReportRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public ReportPreviewResponse preview(ReportPreviewRequest request) {
        ReportType type = ReportType.valueOf(request.getType());
        Map<String, Object> filters = request.getFilters();

        validate(type, filters);

        String filtersJson = toJson(filters == null ? Map.of() : filters);
        GeneratedReport gr = new GeneratedReport();
        gr.setType(type);
        gr.setFiltersJson(filtersJson);
        gr.setCreatedByEmail(SecurityContextUtil.currentEmailOrUnknown());
        gr.setCreatedAt(java.time.LocalDateTime.now());
        gr = generatedReportRepository.save(gr);

        ReportDataService.ReportTable table = reportDataService.fetchReport(type, filters);

        List<List<Object>> previewRows = table.rows().size() > 200 ? table.rows().subList(0, 200) : table.rows();

        return ReportPreviewResponse.builder()
                .reportId(gr.getId())
                .type(type.name())
                .columns(table.columns())
                .rows(previewRows)
                .build();
    }

    @Transactional(readOnly = true)
    public ReportExportService.ExportedFile export(Long reportId, ReportFormat format) {
        GeneratedReport gr = generatedReportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found: " + reportId));

        Map<String, Object> filters = fromJson(gr.getFiltersJson());
        ReportDataService.ReportTable table = reportDataService.fetchReport(gr.getType(), filters);

        String title = switch (gr.getType()) {
            case CAR_LIST -> "Car List Report";
            case USER_LIST -> "User List Report";
            case REVENUE_REPORT -> "Revenue Report";
            case POPULAR_CAR_REPORT -> "Popular Car Report";
        };
        return reportExportService.export(title, table.columns(), table.rows(), format);
    }

    private void validate(ReportType type, Map<String, Object> filters) {
        if (type == ReportType.CAR_LIST) {
            if (filters == null) return;
            Object status = filters.get("status");
            if (status == null) return;
            String s = String.valueOf(status).trim();
            if (s.isBlank()) return;
            if (!List.of("AVAILABLE", "RENTED", "MAINTENANCE", "UNAVAILABLE").contains(s)) {
                throw new IllegalArgumentException("Invalid status filter: " + s);
            }
        } else if (type == ReportType.REVENUE_REPORT || type == ReportType.POPULAR_CAR_REPORT) {
            if (filters == null) return;

            String from = filters.get("dateFrom") == null ? "" : String.valueOf(filters.get("dateFrom")).trim();
            String to = filters.get("dateTo") == null ? "" : String.valueOf(filters.get("dateTo")).trim();

            if (!from.isBlank()) {
                try {
                    java.time.LocalDate.parse(from);
                } catch (Exception e) {
                    throw new IllegalArgumentException("Invalid dateFrom");
                }
            }
            if (!to.isBlank()) {
                try {
                    java.time.LocalDate.parse(to);
                } catch (Exception e) {
                    throw new IllegalArgumentException("Invalid dateTo");
                }
            }
            if (!from.isBlank() && !to.isBlank()) {
                java.time.LocalDate f = java.time.LocalDate.parse(from);
                java.time.LocalDate t = java.time.LocalDate.parse(to);
                if (t.isBefore(f)) throw new IllegalArgumentException("dateTo must be >= dateFrom");
            }

            if (type == ReportType.POPULAR_CAR_REPORT && filters.get("topN") != null) {
                String top = String.valueOf(filters.get("topN")).trim();
                if (!top.isBlank()) {
                    try {
                        int n = Integer.parseInt(top);
                        if (n <= 0 || n > 100) throw new IllegalArgumentException("topN must be between 1 and 100");
                    } catch (NumberFormatException e) {
                        throw new IllegalArgumentException("Invalid topN");
                    }
                }
            }
        }
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Invalid filters payload", e);
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> fromJson(String json) {
        try {
            if (json == null || json.isBlank()) return Map.of();
            return objectMapper.readValue(json, Map.class);
        } catch (Exception e) {
            return Map.of();
        }
    }
}


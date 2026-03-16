package com.swd.reportservice.controller;

import com.swd.reportservice.domain.ReportFormat;
import com.swd.reportservice.dto.ReportOptionsResponse;
import com.swd.reportservice.dto.ReportPreviewRequest;
import com.swd.reportservice.dto.ReportPreviewResponse;
import com.swd.reportservice.service.ReportDefinitionService;
import com.swd.reportservice.service.ReportExportService;
import com.swd.reportservice.service.ReportOrchestrationService;
import com.swb.common.dtos.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportDefinitionService reportDefinitionService;
    private final ReportOrchestrationService reportOrchestrationService;

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/options")
    public ResponseEntity<ApiResponse<ReportOptionsResponse>> options() {
        return ResponseEntity.ok(ApiResponse.success(
                ReportOptionsResponse.builder().options(reportDefinitionService.getOptions()).build(),
                "Successfully retrieved report options"
        ));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/preview")
    public ResponseEntity<ApiResponse<ReportPreviewResponse>> preview(@Valid @RequestBody ReportPreviewRequest request) {
        ReportPreviewResponse data = reportOrchestrationService.preview(request);
        return ResponseEntity.ok(ApiResponse.success(data, "Successfully generated report preview"));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/{reportId}/export")
    public ResponseEntity<byte[]> export(
            @PathVariable Long reportId,
            @RequestParam ReportFormat format
    ) {
        ReportExportService.ExportedFile file = reportOrchestrationService.export(reportId, format);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, file.contentType())
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.fileName() + "\"")
                .body(file.bytes());
    }
}


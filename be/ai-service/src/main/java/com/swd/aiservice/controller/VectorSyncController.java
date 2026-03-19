package com.swd.aiservice.controller;

import com.swb.common.dtos.ApiResponse;
import com.swd.aiservice.service.CarVectorSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai/sync")
@RequiredArgsConstructor
public class VectorSyncController {

    private final CarVectorSyncService carVectorSyncService;

    @PostMapping("/cars")
    public ResponseEntity<ApiResponse<String>> triggerSync() {
        try {
            carVectorSyncService.syncCarsToVectorDb();
            return ResponseEntity.ok(ApiResponse.success("Đồng bộ dữ liệu Vector thành công!", null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error(500, "Lỗi đồng bộ: " + e.getMessage()));
        }
    }
}
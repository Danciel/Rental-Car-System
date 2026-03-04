package com.swd.rentalcar.controller;

import com.swd.rentalcar.dto.request.CarBrandRequest;
import com.swd.rentalcar.dto.request.CarModelRequest;
import com.swd.rentalcar.dto.request.CarRequest;
import com.swd.rentalcar.dto.request.CarTypeRequest;
import com.swd.rentalcar.dto.response.CarBrandResponse;
import com.swd.rentalcar.dto.response.CarModelResponse;
import com.swd.rentalcar.dto.response.CarResponse;
import com.swd.rentalcar.dto.response.CarTypeResponse;
import com.swd.rentalcar.entity.enums.ApprovalStatus;
import com.swd.rentalcar.entity.enums.CarStatus;
import com.swd.rentalcar.service.CarService;
import com.swb.common.dtos.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarService carService;

    // ═════════════════════════════════════════════════════════════════════════
    // CAR BRAND
    // ═════════════════════════════════════════════════════════════════════════

    @PostMapping("/brands")
    public ResponseEntity<ApiResponse<CarBrandResponse>> createCarBrand(
            @Valid @RequestBody CarBrandRequest request) {
        CarBrandResponse data = carService.createCarBrand(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(data, "Tạo thương hiệu xe thành công"));
    }

    @GetMapping("/brands/{id}")
    public ResponseEntity<ApiResponse<CarBrandResponse>> getCarBrandById(@PathVariable Long id) {
        CarBrandResponse data = carService.getCarBrandById(id);
        return ResponseEntity.ok(ApiResponse.success(data, "Lấy thông tin thương hiệu xe thành công"));
    }

    @GetMapping("/brands")
    public ResponseEntity<ApiResponse<List<CarBrandResponse>>> getAllCarBrands() {
        List<CarBrandResponse> data = carService.getAllCarBrands();
        return ResponseEntity.ok(ApiResponse.success(data, "Lấy danh sách thương hiệu xe thành công"));
    }

    @PutMapping("/brands/{id}")
    public ResponseEntity<ApiResponse<CarBrandResponse>> updateCarBrand(
            @PathVariable Long id,
            @Valid @RequestBody CarBrandRequest request) {
        CarBrandResponse data = carService.updateCarBrand(id, request);
        return ResponseEntity.ok(ApiResponse.success(data, "Cập nhật thương hiệu xe thành công"));
    }

    @PatchMapping("/brands/{id}/status")
    public ResponseEntity<ApiResponse<CarBrandResponse>> updateCarBrandApprovalStatus(
            @PathVariable Long id,
            @RequestParam ApprovalStatus status) {
        CarBrandResponse data = carService.updateCarBrandApprovalStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(data, "Cập nhật trạng thái thương hiệu xe thành công"));
    }

    @DeleteMapping("/brands/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCarBrand(@PathVariable Long id) {
        carService.deleteCarBrand(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa thương hiệu xe thành công"));
    }

    // ═════════════════════════════════════════════════════════════════════════
    // CAR TYPE
    // ═════════════════════════════════════════════════════════════════════════

    @PostMapping("/types")
    public ResponseEntity<ApiResponse<CarTypeResponse>> createCarType(
            @Valid @RequestBody CarTypeRequest request) {
        CarTypeResponse data = carService.createCarType(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(data, "Tạo loại xe thành công"));
    }

    @GetMapping("/types/{id}")
    public ResponseEntity<ApiResponse<CarTypeResponse>> getCarTypeById(@PathVariable Long id) {
        CarTypeResponse data = carService.getCarTypeById(id);
        return ResponseEntity.ok(ApiResponse.success(data, "Lấy thông tin loại xe thành công"));
    }

    @GetMapping("/types")
    public ResponseEntity<ApiResponse<List<CarTypeResponse>>> getAllCarTypes() {
        List<CarTypeResponse> data = carService.getAllCarTypes();
        return ResponseEntity.ok(ApiResponse.success(data, "Lấy danh sách loại xe thành công"));
    }

    @PutMapping("/types/{id}")
    public ResponseEntity<ApiResponse<CarTypeResponse>> updateCarType(
            @PathVariable Long id,
            @Valid @RequestBody CarTypeRequest request) {
        CarTypeResponse data = carService.updateCarType(id, request);
        return ResponseEntity.ok(ApiResponse.success(data, "Cập nhật loại xe thành công"));
    }

    @DeleteMapping("/types/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCarType(@PathVariable Long id) {
        carService.deleteCarType(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa loại xe thành công"));
    }

    // ═════════════════════════════════════════════════════════════════════════
    // CAR MODEL
    // ═════════════════════════════════════════════════════════════════════════

    @PostMapping("/models")
    public ResponseEntity<ApiResponse<CarModelResponse>> createCarModel(
            @Valid @RequestBody CarModelRequest request) {
        CarModelResponse data = carService.createCarModel(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(data, "Tạo mẫu xe thành công"));
    }

    @GetMapping("/models/{id}")
    public ResponseEntity<ApiResponse<CarModelResponse>> getCarModelById(@PathVariable Long id) {
        CarModelResponse data = carService.getCarModelById(id);
        return ResponseEntity.ok(ApiResponse.success(data, "Lấy thông tin mẫu xe thành công"));
    }

    @GetMapping("/models")
    public ResponseEntity<ApiResponse<List<CarModelResponse>>> getAllCarModels() {
        List<CarModelResponse> data = carService.getAllCarModels();
        return ResponseEntity.ok(ApiResponse.success(data, "Lấy danh sách mẫu xe thành công"));
    }

    @GetMapping("/brands/{brandId}/models")
    public ResponseEntity<ApiResponse<List<CarModelResponse>>> getCarModelsByBrand(
            @PathVariable Long brandId) {
        List<CarModelResponse> data = carService.getCarModelsByBrand(brandId);
        return ResponseEntity.ok(ApiResponse.success(data, "Lấy danh sách mẫu xe theo thương hiệu thành công"));
    }

    @PutMapping("/models/{id}")
    public ResponseEntity<ApiResponse<CarModelResponse>> updateCarModel(
            @PathVariable Long id,
            @Valid @RequestBody CarModelRequest request) {
        CarModelResponse data = carService.updateCarModel(id, request);
        return ResponseEntity.ok(ApiResponse.success(data, "Cập nhật mẫu xe thành công"));
    }

    @PatchMapping("/models/{id}/status")
    public ResponseEntity<ApiResponse<CarModelResponse>> updateCarModelApprovalStatus(
            @PathVariable Long id,
            @RequestParam ApprovalStatus status) {
        CarModelResponse data = carService.updateCarModelApprovalStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(data, "Cập nhật trạng thái mẫu xe thành công"));
    }

    @DeleteMapping("/models/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCarModel(@PathVariable Long id) {
        carService.deleteCarModel(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa mẫu xe thành công"));
    }

    // ═════════════════════════════════════════════════════════════════════════
    // CAR
    // ═════════════════════════════════════════════════════════════════════════

    @PostMapping
    public ResponseEntity<ApiResponse<CarResponse>> createCar(
            @Valid @RequestBody CarRequest request) {
        CarResponse data = carService.createCar(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(data, "Tạo xe thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CarResponse>> getCarById(@PathVariable Long id) {
        CarResponse data = carService.getCarById(id);
        return ResponseEntity.ok(ApiResponse.success(data, "Lấy thông tin xe thành công"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CarResponse>>> getAllCars(
            @RequestParam(required = false) CarStatus status,
            @RequestParam(required = false) Long modelId,
            @RequestParam(required = false) Long brandId) {
        List<CarResponse> data;
        String message;

        if (status != null) {
            data = carService.getCarsByStatus(status);
            message = "Lấy danh sách xe theo trạng thái thành công";
        } else if (modelId != null) {
            data = carService.getCarsByModel(modelId);
            message = "Lấy danh sách xe theo mẫu xe thành công";
        } else if (brandId != null) {
            data = carService.getCarsByBrand(brandId);
            message = "Lấy danh sách xe theo thương hiệu thành công";
        } else {
            data = carService.getAllCars();
            message = "Lấy danh sách xe thành công";
        }

        return ResponseEntity.ok(ApiResponse.success(data, message));
    }

    //TODO: Later
//    @GetMapping("/licenseplate/{licensePlate}")
//    public ResponseEntity<ApiResponse<CarResponse>> getCarByLicensePlate(
//            @PathVariable String licensePlate) {
//        CarResponse data = carService.getCarByLicensePlate(licensePlate);
//        return ResponseEntity.ok(ApiResponse.success(data, "Lấy thông tin xe theo biển số thành công"));
//    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CarResponse>> updateCar(
            @PathVariable Long id,
            @Valid @RequestBody CarRequest request) {
        CarResponse data = carService.updateCar(id, request);
        return ResponseEntity.ok(ApiResponse.success(data, "Cập nhật xe thành công"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<CarResponse>> updateCarStatus(
            @PathVariable Long id,
            @RequestParam CarStatus status) {
        CarResponse data = carService.updateCarStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(data, "Cập nhật trạng thái xe thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa xe thành công"));
    }
}
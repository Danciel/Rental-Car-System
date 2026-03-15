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
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/brands")
    public ResponseEntity<ApiResponse<CarBrandResponse>> createCarBrand(
            @Valid @RequestBody CarBrandRequest request) {
        CarBrandResponse data = carService.createCarBrand(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(data, "Successfully created car brand"));
    }

    @GetMapping("/brands/{id}")
    public ResponseEntity<ApiResponse<CarBrandResponse>> getCarBrandById(@PathVariable Long id) {
        CarBrandResponse data = carService.getCarBrandById(id);
        return ResponseEntity.ok(ApiResponse.success(data, "Successfully retrieved car brand details"));
    }

    @GetMapping("/brands")
    public ResponseEntity<ApiResponse<List<CarBrandResponse>>> getAllCarBrands() {
        List<CarBrandResponse> data = carService.getAllCarBrands();
        return ResponseEntity.ok(ApiResponse.success(data, "Successfully retrieved the list of car brands"));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/brands/{id}")
    public ResponseEntity<ApiResponse<CarBrandResponse>> updateCarBrand(
            @PathVariable Long id,
            @Valid @RequestBody CarBrandRequest request) {
        CarBrandResponse data = carService.updateCarBrand(id, request);
        return ResponseEntity.ok(ApiResponse.success(data, "Successfully updated car brand"));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PatchMapping("/brands/{id}/status")
    public ResponseEntity<ApiResponse<CarBrandResponse>> updateCarBrandApprovalStatus(
            @PathVariable Long id,
            @RequestParam ApprovalStatus status) {
        CarBrandResponse data = carService.updateCarBrandApprovalStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(data, "Successfully updated car brand status"));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/brands/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCarBrand(@PathVariable Long id) {
        carService.deleteCarBrand(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Successfully deleted car brand"));
    }

    // ═════════════════════════════════════════════════════════════════════════
    // CAR TYPE
    // ═════════════════════════════════════════════════════════════════════════

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/types")
    public ResponseEntity<ApiResponse<CarTypeResponse>> createCarType(
            @Valid @RequestBody CarTypeRequest request) {
        CarTypeResponse data = carService.createCarType(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(data, "Successfully created car type"));
    }

    @GetMapping("/types/{id}")
    public ResponseEntity<ApiResponse<CarTypeResponse>> getCarTypeById(@PathVariable Long id) {
        CarTypeResponse data = carService.getCarTypeById(id);
        return ResponseEntity.ok(ApiResponse.success(data, "Successfully retrieved car type details"));
    }

    @GetMapping("/types")
    public ResponseEntity<ApiResponse<List<CarTypeResponse>>> getAllCarTypes() {
        List<CarTypeResponse> data = carService.getAllCarTypes();
        return ResponseEntity.ok(ApiResponse.success(data, "Successfully retrieved the list of car types"));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/types/{id}")
    public ResponseEntity<ApiResponse<CarTypeResponse>> updateCarType(
            @PathVariable Long id,
            @Valid @RequestBody CarTypeRequest request) {
        CarTypeResponse data = carService.updateCarType(id, request);
        return ResponseEntity.ok(ApiResponse.success(data, "Successfully updated car type"));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/types/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCarType(@PathVariable Long id) {
        carService.deleteCarType(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Successfully deleted car type"));
    }

    // ═════════════════════════════════════════════════════════════════════════
    // CAR MODEL
    // ═════════════════════════════════════════════════════════════════════════

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/models")
    public ResponseEntity<ApiResponse<CarModelResponse>> createCarModel(
            @Valid @RequestBody CarModelRequest request) {
        CarModelResponse data = carService.createCarModel(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(data, "Successfully created car model"));
    }

    @GetMapping("/models/{id}")
    public ResponseEntity<ApiResponse<CarModelResponse>> getCarModelById(@PathVariable Long id) {
        CarModelResponse data = carService.getCarModelById(id);
        return ResponseEntity.ok(ApiResponse.success(data, "Successfully retrieved car model details"));
    }

    @GetMapping("/models")
    public ResponseEntity<ApiResponse<List<CarModelResponse>>> getAllCarModels() {
        List<CarModelResponse> data = carService.getAllCarModels();
        return ResponseEntity.ok(ApiResponse.success(data, "Successfully retrieved the list of car models"));
    }

    @GetMapping("/brands/{brandId}/models")
    public ResponseEntity<ApiResponse<List<CarModelResponse>>> getCarModelsByBrand(
            @PathVariable Long brandId) {
        List<CarModelResponse> data = carService.getCarModelsByBrand(brandId);
        return ResponseEntity.ok(ApiResponse.success(data, "Successfully retrieved car models by brand"));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/models/{id}")
    public ResponseEntity<ApiResponse<CarModelResponse>> updateCarModel(
            @PathVariable Long id,
            @Valid @RequestBody CarModelRequest request) {
        CarModelResponse data = carService.updateCarModel(id, request);
        return ResponseEntity.ok(ApiResponse.success(data, "Successfully updated car model"));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PatchMapping("/models/{id}/status")
    public ResponseEntity<ApiResponse<CarModelResponse>> updateCarModelApprovalStatus(
            @PathVariable Long id,
            @RequestParam ApprovalStatus status) {
        CarModelResponse data = carService.updateCarModelApprovalStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(data, "Successfully updated car model status"));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/models/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCarModel(@PathVariable Long id) {
        carService.deleteCarModel(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Successfully deleted car model"));
    }

    // ═════════════════════════════════════════════════════════════════════════
    // CAR
    // ═════════════════════════════════════════════════════════════════════════

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<CarResponse>> createCar(
            @Valid @RequestBody CarRequest request) {
        CarResponse data = carService.createCar(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(data, "Successfully created car"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CarResponse>> getCarById(@PathVariable Long id) {
        CarResponse data = carService.getCarById(id);
        return ResponseEntity.ok(ApiResponse.success(data, "Successfully retrieved car details"));
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
            message = "Successfully retrieved cars by status";
        } else if (modelId != null) {
            data = carService.getCarsByModel(modelId);
            message = "Successfully retrieved cars by model";
        } else if (brandId != null) {
            data = carService.getCarsByBrand(brandId);
            message = "Successfully retrieved cars by brand";
        } else {
            data = carService.getAllCars();
            message = "Successfully retrieved all cars";
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
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CarResponse>> updateCar(
            @PathVariable Long id,
            @Valid @RequestBody CarRequest request) {
        CarResponse data = carService.updateCar(id, request);
        return ResponseEntity.ok(ApiResponse.success(data, "Successfully updated car"));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<CarResponse>> updateCarStatus(
            @PathVariable Long id,
            @RequestParam CarStatus status) {
        CarResponse data = carService.updateCarStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(data, "Successfully updated car status"));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Successfully deleted car"));
    }

    // ═════════════════════════════════════════════════════════════════════════
// CAR REGISTRATION
// ═════════════════════════════════════════════════════════════════════════

    @PreAuthorize("hasAnyAuthority('ROLE_CUSTOMER', 'ROLE_OWNER')")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<CarResponse>> registerCar(
            @RequestHeader("X-User-Email") String email,
            @Valid @RequestBody CarRequest request) {
        CarResponse data = carService.registerCar(request, email);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(data, "Car has been submitted for approval. Please wait for staff confirmation."));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/pending-review")
    public ResponseEntity<ApiResponse<List<CarResponse>>> getPendingReviewCars() {
        List<CarResponse> data = carService.getPendingReviewCars();
        return ResponseEntity.ok(ApiResponse.success(data, "Successfully retrieved cars pending review"));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PatchMapping("/{id}/review")
    public ResponseEntity<ApiResponse<CarResponse>> reviewCar(
            @PathVariable Long id,
            @RequestParam ApprovalStatus decision,
            @RequestHeader("X-User-Email") String staffEmail) {
        CarResponse data = carService.reviewCar(id, decision, staffEmail);
        String message = decision == ApprovalStatus.APPROVED
                ? "The car has been approved and listed on the system"
                : "The car has been rejected";
        return ResponseEntity.ok(ApiResponse.success(data, message));
    }
}
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
    public ResponseEntity<CarBrandResponse> createCarBrand(
            @Valid @RequestBody CarBrandRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(carService.createCarBrand(request));
    }

    @GetMapping("/brands/{id}")
    public ResponseEntity<CarBrandResponse> getCarBrandById(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getCarBrandById(id));
    }

    @GetMapping("/brands")
    public ResponseEntity<List<CarBrandResponse>> getAllCarBrands() {
        return ResponseEntity.ok(carService.getAllCarBrands());
    }

    @PutMapping("/brands/{id}")
    public ResponseEntity<CarBrandResponse> updateCarBrand(
            @PathVariable Long id,
            @Valid @RequestBody CarBrandRequest request) {
        return ResponseEntity.ok(carService.updateCarBrand(id, request));
    }

    @PatchMapping("/brands/{id}/status")
    public ResponseEntity<CarBrandResponse> updateCarBrandApprovalStatus(
            @PathVariable Long id,
            @RequestParam ApprovalStatus status) {
        return ResponseEntity.ok(carService.updateCarBrandApprovalStatus(id, status));
    }

    @DeleteMapping("/brands/{id}")
    public ResponseEntity<Void> deleteCarBrand(@PathVariable Long id) {
        carService.deleteCarBrand(id);
        return ResponseEntity.noContent().build();
    }

    // ═════════════════════════════════════════════════════════════════════════
    // CAR TYPE
    // ═════════════════════════════════════════════════════════════════════════

    @PostMapping("/types")
    public ResponseEntity<CarTypeResponse> createCarType(
            @Valid @RequestBody CarTypeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(carService.createCarType(request));
    }

    @GetMapping("/types/{id}")
    public ResponseEntity<CarTypeResponse> getCarTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getCarTypeById(id));
    }

    @GetMapping("/types")
    public ResponseEntity<List<CarTypeResponse>> getAllCarTypes() {
        return ResponseEntity.ok(carService.getAllCarTypes());
    }

    @PutMapping("/types/{id}")
    public ResponseEntity<CarTypeResponse> updateCarType(
            @PathVariable Long id,
            @Valid @RequestBody CarTypeRequest request) {
        return ResponseEntity.ok(carService.updateCarType(id, request));
    }

    @DeleteMapping("/types/{id}")
    public ResponseEntity<Void> deleteCarType(@PathVariable Long id) {
        carService.deleteCarType(id);
        return ResponseEntity.noContent().build();
    }

    // ═════════════════════════════════════════════════════════════════════════
    // CAR MODEL
    // ═════════════════════════════════════════════════════════════════════════

    @PostMapping("/models")
    public ResponseEntity<CarModelResponse> createCarModel(
            @Valid @RequestBody CarModelRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(carService.createCarModel(request));
    }

    @GetMapping("/models/{id}")
    public ResponseEntity<CarModelResponse> getCarModelById(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getCarModelById(id));
    }

    @GetMapping("/models")
    public ResponseEntity<List<CarModelResponse>> getAllCarModels() {
        return ResponseEntity.ok(carService.getAllCarModels());
    }

    @GetMapping("/brands/{brandId}/models")
    public ResponseEntity<List<CarModelResponse>> getCarModelsByBrand(@PathVariable Long brandId) {
        return ResponseEntity.ok(carService.getCarModelsByBrand(brandId));
    }

    @PutMapping("/models/{id}")
    public ResponseEntity<CarModelResponse> updateCarModel(
            @PathVariable Long id,
            @Valid @RequestBody CarModelRequest request) {
        return ResponseEntity.ok(carService.updateCarModel(id, request));
    }

    @PatchMapping("/models/{id}/status")
    public ResponseEntity<CarModelResponse> updateCarModelApprovalStatus(
            @PathVariable Long id,
            @RequestParam ApprovalStatus status) {
        return ResponseEntity.ok(carService.updateCarModelApprovalStatus(id, status));
    }

    @DeleteMapping("/models/{id}")
    public ResponseEntity<Void> deleteCarModel(@PathVariable Long id) {
        carService.deleteCarModel(id);
        return ResponseEntity.noContent().build();
    }

    // ═════════════════════════════════════════════════════════════════════════
    // CAR
    // ═════════════════════════════════════════════════════════════════════════

    @PostMapping
    public ResponseEntity<CarResponse> createCar(
            @Valid @RequestBody CarRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(carService.createCar(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarResponse> getCarById(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getCarById(id));
    }

    @GetMapping
    public ResponseEntity<List<CarResponse>> getAllCars(
            @RequestParam(required = false) CarStatus status,
            @RequestParam(required = false) Long modelId) {
        if (status != null) {
            return ResponseEntity.ok(carService.getCarsByStatus(status));
        }
        if (modelId != null) {
            return ResponseEntity.ok(carService.getCarsByModel(modelId));
        }
        return ResponseEntity.ok(carService.getAllCars());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarResponse> updateCar(
            @PathVariable Long id,
            @Valid @RequestBody CarRequest request) {
        return ResponseEntity.ok(carService.updateCar(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CarResponse> updateCarStatus(
            @PathVariable Long id,
            @RequestParam CarStatus status) {
        return ResponseEntity.ok(carService.updateCarStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.noContent().build();
    }
}
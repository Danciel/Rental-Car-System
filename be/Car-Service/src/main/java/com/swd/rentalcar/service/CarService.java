package com.swd.rentalcar.service;

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
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CarService {
    // ── CAR BRAND ─────────────────────────────────────────────────────────────

    CarBrandResponse createCarBrand(CarBrandRequest request);

    CarBrandResponse getCarBrandById(Long id);

    List<CarBrandResponse> getAllCarBrands();

    CarBrandResponse updateCarBrand(Long id, CarBrandRequest request);

    CarBrandResponse updateCarBrandApprovalStatus(Long id, ApprovalStatus status);

    void deleteCarBrand(Long id);

    // ── CAR TYPE ──────────────────────────────────────────────────────────────

    CarTypeResponse createCarType(CarTypeRequest request);

    CarTypeResponse getCarTypeById(Long id);

    List<CarTypeResponse> getAllCarTypes();

    CarTypeResponse updateCarType(Long id, CarTypeRequest request);

    void deleteCarType(Long id);

    // ── CAR MODEL ─────────────────────────────────────────────────────────────

    CarModelResponse createCarModel(CarModelRequest request);

    CarModelResponse getCarModelById(Long id);

    List<CarModelResponse> getAllCarModels();

    List<CarModelResponse> getCarModelsByBrand(Long brandId);

    CarModelResponse updateCarModel(Long id, CarModelRequest request);

    CarModelResponse updateCarModelApprovalStatus(Long id, ApprovalStatus status);

    void deleteCarModel(Long id);

    // ── CAR ───────────────────────────────────────────────────────────────────

    CarResponse createCar(CarRequest request);

    CarResponse getCarById(Long id);

    List<CarResponse> getAllCars();

    List<CarResponse> getCarsByStatus(CarStatus status);

    List<CarResponse> getCarsByModel(Long carModelId);

    CarResponse updateCar(Long id, CarRequest request);

    CarResponse updateCarStatus(Long id, CarStatus status);

    void deleteCar(Long id);
}

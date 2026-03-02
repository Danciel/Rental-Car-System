package com.swd.rentalcar.service;

import com.swd.rentalcar.dto.request.*;
import com.swd.rentalcar.dto.response.*;
import com.swd.rentalcar.entity.*;
import com.swd.rentalcar.entity.enums.ApprovalStatus;
import com.swd.rentalcar.entity.enums.CarStatus;
import com.swd.rentalcar.entity.enums.FuelType;
import com.swd.rentalcar.repository.CarBrandRepository;
import com.swd.rentalcar.repository.CarModelRepository;
import com.swd.rentalcar.repository.CarRepository;
import com.swd.rentalcar.repository.CarTypeRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CarServiceImpl implements CarService{

    private CarRepository carRepository;
    private CarModelRepository carModelRepository;
    private CarBrandRepository carBrandRepository;
    private CarTypeRepository carTypeRepository;

    // ═════════════════════════════════════════════════════════════════════════
    // CAR BRAND
    // ═════════════════════════════════════════════════════════════════════════

    @Override
    public CarBrandResponse createCarBrand(CarBrandRequest request) {
        if (carBrandRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Tên thương hiệu đã tồn tại: " + request.getName());
        }
        CarBrand brand = new CarBrand();
        brand.setName(request.getName());
        brand.setLogoUrl(request.getLogoUrl());
        brand.setApprovalStatus(ApprovalStatus.PENDING);
        return toResponse(carBrandRepository.save(brand));
    }

    @Override
    public CarBrandResponse getCarBrandById(Long id) {
        return toResponse(findBrandById(id));
    }

    @Override
    public List<CarBrandResponse> getAllCarBrands() {
        return carBrandRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CarBrandResponse updateCarBrand(Long id, CarBrandRequest request) {
        CarBrand brand = findBrandById(id);
        brand.setName(request.getName());
        brand.setLogoUrl(request.getLogoUrl());
        return toResponse(carBrandRepository.save(brand));
    }

    @Override
    public CarBrandResponse updateCarBrandApprovalStatus(Long id, ApprovalStatus status) {
        CarBrand brand = findBrandById(id);
        brand.setApprovalStatus(status);
        return toResponse(carBrandRepository.save(brand));
    }

    @Override
    public void deleteCarBrand(Long id) {
        carBrandRepository.delete(findBrandById(id));
    }

    // ═════════════════════════════════════════════════════════════════════════
    // CAR TYPE
    // ═════════════════════════════════════════════════════════════════════════

    @Override
    public CarTypeResponse createCarType(CarTypeRequest request) {
        if (carTypeRepository.existsByTypeName(request.getTypeName())) {
            throw new IllegalArgumentException("Loại xe đã tồn tại: " + request.getTypeName());
        }
        CarType carType = new CarType();
        carType.setTypeName(request.getTypeName());
        return toResponse(carTypeRepository.save(carType));
    }

    @Override
    public CarTypeResponse getCarTypeById(Long id) {
        return toResponse(findTypeById(id));
    }

    @Override
    public List<CarTypeResponse> getAllCarTypes() {
        return carTypeRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CarTypeResponse updateCarType(Long id, CarTypeRequest request) {
        CarType carType = findTypeById(id);
        carType.setTypeName(request.getTypeName());
        return toResponse(carTypeRepository.save(carType));
    }

    @Override
    public void deleteCarType(Long id) {
        carTypeRepository.delete(findTypeById(id));
    }

    // ═════════════════════════════════════════════════════════════════════════
    // CAR MODEL
    // ═════════════════════════════════════════════════════════════════════════

    @Override
    public CarModelResponse createCarModel(CarModelRequest request) {
        CarBrand brand = findBrandById(request.getBrandId());
        CarType type = findTypeById(request.getTypeId());

        CarModel model = new CarModel();
        mapRequestToModel(request, model, brand, type);
        model.setApprovalStatus(ApprovalStatus.PENDING);

        return toResponse(carModelRepository.save(model));
    }

    @Override
    public CarModelResponse getCarModelById(Long id) {
        return toResponse(findModelById(id));
    }

    @Override
    public List<CarModelResponse> getAllCarModels() {
        return carModelRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CarModelResponse> getCarModelsByBrand(Long brandId) {
        CarBrand brand = findBrandById(brandId);
        return brand.getCarModels()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CarModelResponse updateCarModel(Long id, CarModelRequest request) {
        CarModel model = findModelById(id);
        CarBrand brand = findBrandById(request.getBrandId());
        CarType type = findTypeById(request.getTypeId());
        mapRequestToModel(request, model, brand, type);
        return toResponse(carModelRepository.save(model));
    }

    @Override
    public CarModelResponse updateCarModelApprovalStatus(Long id, ApprovalStatus status) {
        CarModel model = findModelById(id);
        model.setApprovalStatus(status);
        return toResponse(carModelRepository.save(model));
    }

    @Override
    public void deleteCarModel(Long id) {
        carModelRepository.delete(findModelById(id));
    }

    // ═════════════════════════════════════════════════════════════════════════
    // CAR
    // ═════════════════════════════════════════════════════════════════════════

    @Override
    @Transactional
    public CarResponse createCar(CarRequest request) {
        if (carRepository.existsByLicensePlate(request.getLicensePlate())) {
            throw new IllegalArgumentException("Biển số xe đã tồn tại: " + request.getLicensePlate());
        }

        CarModel carModel = findModelById(request.getCarModelId());

        Car car = new Car();
        car.setLicensePlate(request.getLicensePlate());
        car.setBasePricePerDay(request.getBasePricePerDay());
        car.setDepositAmount(request.getDepositAmount());
        car.setStatus(CarStatus.AVAILABLE);
        car.setCarModel(carModel);
        car.setImages(new HashSet<>());

        if (request.getImages() != null) {
            request.getImages().forEach(imgRequest ->
                    car.addCarImage(buildCarImage(imgRequest, car)));
        }

        return toResponse(carRepository.save(car));
    }

    @Override
    public CarResponse getCarById(Long id) {
        return toResponse(findCarById(id));
    }

    @Override
    public List<CarResponse> getAllCars() {
        return carRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CarResponse> getCarsByStatus(CarStatus status) {
        return carRepository.findByStatus(status)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CarResponse> getCarsByModel(Long carModelId) {
        return carRepository.findByCarModelId(carModelId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CarResponse updateCar(Long id, CarRequest request) {
        Car car = findCarById(id);
        CarModel carModel = findModelById(request.getCarModelId());

        car.setLicensePlate(request.getLicensePlate());
        car.setBasePricePerDay(request.getBasePricePerDay());
        car.setDepositAmount(request.getDepositAmount());
        car.setCarModel(carModel);

        if (request.getImages() != null) {
            car.getImages().clear();
            request.getImages().forEach(imgRequest ->
                    car.addCarImage(buildCarImage(imgRequest, car)));
        }

        return toResponse(carRepository.save(car));
    }

    @Override
    public CarResponse updateCarStatus(Long id, CarStatus status) {
        Car car = findCarById(id);
        car.setStatus(status);
        return toResponse(carRepository.save(car));
    }

    @Override
    public void deleteCar(Long id) {
        carRepository.delete(findCarById(id));
    }

    // ═════════════════════════════════════════════════════════════════════════
    // PRIVATE FINDERS
    // ═════════════════════════════════════════════════════════════════════════

    private CarBrand findBrandById(Long id) {
        return carBrandRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thương hiệu xe với mã: " + id));
    }

    private CarType findTypeById(Long id) {
        return carTypeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy loại xe với mã: " + id));
    }

    private CarModel findModelById(Long id) {
        return carModelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy mẫu xe với mã: " + id));
    }

    private Car findCarById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy xe với mã: " + id));
    }

    // ═════════════════════════════════════════════════════════════════════════
    // PRIVATE MAPPERS
    // ═════════════════════════════════════════════════════════════════════════

    private void mapRequestToModel(CarModelRequest request, CarModel model, CarBrand brand, CarType type) {
        model.setName(request.getName());
        model.setDescription(request.getDescription());
        model.setYear(request.getYear());
        model.setFuelType(request.getFuelType());
        model.setFuelCapacity(request.getFuelCapacity());
        model.setBatteryCapacity(request.getBatteryCapacity());
        model.setTransmission(request.getTransmission());
        model.setSeats(request.getSeats());
        model.setBrand(brand);
        model.setType(type);
    }

    private CarImage buildCarImage(CarImageRequest request, Car car) {
        CarImage image = new CarImage();
        image.setImageUrl(request.getImageUrl());
        image.setIsThumbnail(request.getIsThumbnail());
        image.setCar(car);
        return image;
    }

    private String buildCapacityDisplay(CarModel model) {
        FuelType fuelType = model.getFuelType();
        BigDecimal fuel = model.getFuelCapacity();
        BigDecimal battery = model.getBatteryCapacity();

        if (fuelType == null) return "N/A";

        return switch (fuelType) {
            case ELECTRIC -> battery != null ? battery + " kWh" : "N/A";
            case HYBRID   -> {
                String fuelPart    = fuel    != null ? fuel + " L"      : "N/A";
                String batteryPart = battery != null ? battery + " kWh" : "N/A";
                yield fuelPart + " / " + batteryPart;
            }
            default       -> fuel != null ? fuel + " L" : "N/A";
        };
    }

    private CarResponse toResponse(Car car) {
        CarResponse response = new CarResponse();
        response.setId(car.getId());
        response.setLicensePlate(car.getLicensePlate());
        response.setBasePricePerDay(car.getBasePricePerDay());
        response.setDepositAmount(car.getDepositAmount());
        response.setStatus(car.getStatus());
        response.setCarModelId(toResponse(car.getCarModel()));
        response.setImages(car.getImages().stream().map(this::toResponse).toList());

        return response;
    }

    private CarBrandResponse toResponse(CarBrand carBrand) {
        CarBrandResponse response = new CarBrandResponse();
        response.setId(carBrand.getId());
        response.setName(carBrand.getName());
        response.setLogoUrl(carBrand.getLogoUrl());
        response.setApprovalStatus(carBrand.getApprovalStatus());
        return response;
    }

    private CarModelResponse toResponse(CarModel carModel) {
        CarModelResponse response = new CarModelResponse();
        response.setId(carModel.getId());
        response.setName(carModel.getName());
        response.setDescription(carModel.getDescription());
        response.setApprovalStatus(carModel.getApprovalStatus());
        response.setYear(carModel.getYear());
        response.setFuelType(carModel.getFuelType());
        response.setFuelCapacity(carModel.getFuelCapacity());
        response.setBatteryCapacity(carModel.getBatteryCapacity());
        response.setTransmission(carModel.getTransmission());
        response.setSeats(carModel.getSeats());
        response.setBrandId(carModel.getBrand().getId());
        return response;
    }

    private CarImageResponse toResponse(CarImage carImage) {
        CarImageResponse response = new CarImageResponse();
        response.setId(carImage.getId());
        response.setImageUrl(carImage.getImageUrl());
        response.setCarId(carImage.getCar().getId());
        return response;
    }

    private CarTypeResponse toResponse(CarType carType) {
        CarTypeResponse response = new CarTypeResponse();
        response.setId(carType.getId());
        response.setTypeName(carType.getTypeName());
        return response;
    }
}

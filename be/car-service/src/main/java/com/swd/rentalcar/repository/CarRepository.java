package com.swd.rentalcar.repository;

import com.swd.rentalcar.entity.Car;
import com.swd.rentalcar.entity.enums.CarStatus;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    boolean existsByLicensePlate(@NotBlank(message = "License plate is required") String licensePlate);

    List<Car> findByStatus(CarStatus status);

    List<Car> findByCarModelId(Long carModelId);

    Optional<Car> findByLicensePlate(String licensePlate);

    List<Car> findByCarModelBrandId(Long brandId);
}

package com.swd.aiservice.repository;

import com.swd.rentalcar.entity.Car;
import com.swd.rentalcar.entity.enums.CarStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    // Chỉ lấy những xe đang ở trạng thái có thể thuê
    List<Car> findByStatus(CarStatus status);
}
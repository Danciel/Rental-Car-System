package com.swd.rentalcar.repository;

import com.swd.rentalcar.entity.CarBrand;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarBrandRepository extends JpaRepository<CarBrand, Long> {
    boolean existsByName(@NotBlank(message = "Brand name is required") String name);
}

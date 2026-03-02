package com.swd.rentalcar.repository;

import com.swd.rentalcar.entity.CarType;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarTypeRepository extends JpaRepository<CarType, Long> {
    boolean existsByTypeName(@NotBlank(message = "Type name is required") String typeName);
}

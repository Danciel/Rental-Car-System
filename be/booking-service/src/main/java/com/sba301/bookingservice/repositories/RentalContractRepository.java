package com.sba301.bookingservice.repositories;

import com.sba301.bookingservice.entities.RentalContract;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RentalContractRepository extends JpaRepository<RentalContract, Long> {
}


package com.sba301.bookingservice.repositories;

import com.sba301.bookingservice.entities.CarInspectReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarInspectReportRepository extends JpaRepository<CarInspectReport, Long> {
}


package com.swd.reportservice.repository;

import com.swd.reportservice.entity.GeneratedReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GeneratedReportRepository extends JpaRepository<GeneratedReport, Long> {
}


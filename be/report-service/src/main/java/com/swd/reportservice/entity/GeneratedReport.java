package com.swd.reportservice.entity;

import com.swd.reportservice.domain.ReportType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "generated_report")
public class GeneratedReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportType type;

    @Column(nullable = false, columnDefinition = "text")
    private String filtersJson;

    @Column(nullable = false)
    private String createdByEmail;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}


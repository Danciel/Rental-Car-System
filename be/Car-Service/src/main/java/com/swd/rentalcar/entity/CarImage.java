package com.swd.rentalcar.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
public class CarImage {
    @Id
    @GeneratedValue (strategy = GenerationType.AUTO)
    private Long id;

    @Column (nullable = false)
    private String imageUrl;

    @Column (nullable = false)
    private Boolean isThumbnail;

    @ManyToOne
    @JoinColumn
    private Car car;

}

package com.swd.rentalcar.entity;


import com.swd.rentalcar.entity.enums.CarStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Set;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
public class Car {
    @Id
    @GeneratedValue (strategy = GenerationType.AUTO)
    private Long id;

    @Column (unique = true, nullable = false)
    private String licensePlate;

    @Column (nullable = false)
    private BigDecimal basePricePerDay;

    @Column
    private BigDecimal depositAmount;

    @Column (nullable = false)
    private CarStatus status;

    @ManyToOne
    @JoinColumn
    private CarModel carModel;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<CarImage> images;

    public void addCarImage(CarImage carImage) {
        images.add(carImage);
        carImage.setCar(this);
    }

    public void removeCarImage(CarImage carImage) {
        images.remove(carImage);
        carImage.setCar(null);
    }

    //TODO: add ownerId when we have user entity
    //private Long ownerId;

}

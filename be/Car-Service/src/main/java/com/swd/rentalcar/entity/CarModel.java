package com.swd.rentalcar.entity;

import com.swd.rentalcar.entity.enums.ApprovalStatus;
import com.swd.rentalcar.entity.enums.FuelType;
import com.swd.rentalcar.entity.enums.TransmissionType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Set;

@Entity
@Table
@NoArgsConstructor
@Getter
@Setter
public class CarModel {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.AUTO)
    private Long id;

    @Column (nullable = false)
    private String name;

    @Column
    private String description;

    @Enumerated(EnumType.STRING)
    private ApprovalStatus approvalStatus;

    @Column (nullable = false)
    private Integer year;

    @Enumerated(EnumType.STRING)
    private FuelType fuelType;

    @Column
    private BigDecimal fuelCapacity;      // in liters (for combustion/hybrid)
    @Column
    private BigDecimal batteryCapacity;   // in kWh (for electric/hybrid)

    @Enumerated(EnumType.STRING)
    private TransmissionType transmission;

    private Integer seats;

    @ManyToOne
    @JoinColumn
    private CarBrand brand;

    @ManyToOne
    @JoinColumn
    private CarType type;

    @OneToMany(mappedBy = "carModel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Car> cars;

    public void addCar(Car car) {
        cars.add(car);
        car.setCarModel(this);
    }

    public void removeCar(Car car) {
        cars.remove(car);
        car.setCarModel(null);
    }

    public String getCapacityDisplay(CarModel model) {
        return switch (model.getFuelType()) {
            case ELECTRIC -> model.getBatteryCapacity() + " kWh";
            case HYBRID   -> model.getFuelCapacity() + " L / " + model.getBatteryCapacity() + " kWh";
            default       -> model.getFuelCapacity() + " L";
        };
    }
}

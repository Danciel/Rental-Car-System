package com.swd.rentalcar.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
public class CarType {
    @Id
    @GeneratedValue (strategy = jakarta.persistence.GenerationType.AUTO)
    private Long id;

    @Column (unique = true, nullable = false)
    private String typeName;

    @OneToMany (mappedBy = "type", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<CarModel> carModels;

    public void addCarModel(CarModel carModel) {
        carModels.add(carModel);
        carModel.setType(this);
    }

    public void removeCarModel(CarModel carModel) {
        carModels.remove(carModel);
        carModel.setType(null);
    }
}

package com.swd.rentalcar.entity;

import com.swd.rentalcar.entity.enums.ApprovalStatus;
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
public class CarBrand {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.AUTO)
    private Long id;

    @Column (unique = true, nullable = false)
    private String name;

    @Column
    private String logoUrl;

    @Enumerated(EnumType.STRING)
    private ApprovalStatus approvalStatus;

    @OneToMany(mappedBy = "brand", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<CarModel> carModels;

    public void addCarModel(CarModel carModel) {
        carModels.add(carModel);
        carModel.setBrand(this);
    }

    public void removeCarModel(CarModel carModel) {
        carModels.remove(carModel);
        carModel.setBrand(null);
    }
}

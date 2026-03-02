package com.swd.rentalcar.config;

import com.swd.rentalcar.entity.*;
import com.swd.rentalcar.entity.enums.ApprovalStatus;
import com.swd.rentalcar.entity.enums.CarStatus;
import com.swd.rentalcar.entity.enums.FuelType;
import com.swd.rentalcar.entity.enums.TransmissionType;
import com.swd.rentalcar.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CarBrandRepository carBrandRepository;
    private final CarTypeRepository carTypeRepository;
    private final CarModelRepository carModelRepository;
    private final CarRepository carRepository;

    @Override
    public void run(String... args) {
        if (carBrandRepository.count() > 0) {
            log.info("Database already seeded, skipping...");
            return;
        }

        log.info("Seeding database...");

        // ── CAR TYPES ─────────────────────────────────────────────────────────
        CarType sedan    = carType("Sedan");
        CarType suv      = carType("SUV");
        CarType hatchback = carType("Hatchback");
        CarType truck    = carType("Truck");
        carTypeRepository.saveAll(List.of(sedan, suv, hatchback, truck));
        log.info("Seeded {} car types", 4);

        // ── CAR BRANDS ────────────────────────────────────────────────────────
        CarBrand toyota = carBrand("Toyota",  "https://logo.clearbit.com/toyota.com");
        CarBrand honda  = carBrand("Honda",   "https://logo.clearbit.com/honda.com");
        CarBrand ford   = carBrand("Ford",    "https://logo.clearbit.com/ford.com");
        CarBrand tesla  = carBrand("Tesla",   "https://logo.clearbit.com/tesla.com");
        carBrandRepository.saveAll(List.of(toyota, honda, ford, tesla));
        log.info("Seeded {} car brands", 4);

        // ── CAR MODELS ────────────────────────────────────────────────────────
        CarModel camry = carModel(
                "Camry", "A reliable and comfortable mid-size sedan.",
                2023, FuelType.GASOLINE, new BigDecimal("70"), null,
                TransmissionType.AUTOMATIC, 5, toyota, sedan
        );
        CarModel corolla = carModel(
                "Corolla", "A compact sedan known for fuel efficiency.",
                2022, FuelType.HYBRID, new BigDecimal("50"), new BigDecimal("8.8"),
                TransmissionType.AUTOMATIC, 5, toyota, sedan
        );
        CarModel rav4 = carModel(
                "RAV4", "A versatile and spacious SUV for all terrains.",
                2023, FuelType.HYBRID, new BigDecimal("55"), new BigDecimal("18.1"),
                TransmissionType.AUTOMATIC, 5, toyota, suv
        );
        CarModel civic = carModel(
                "Civic", "A sporty and efficient compact hatchback.",
                2023, FuelType.GASOLINE, new BigDecimal("47"), null,
                TransmissionType.MANUAL, 5, honda, hatchback
        );
        CarModel crv = carModel(
                "CR-V", "A practical family SUV with great cargo space.",
                2022, FuelType.GASOLINE, new BigDecimal("57"), null,
                TransmissionType.AUTOMATIC, 5, honda, suv
        );
        CarModel f150 = carModel(
                "F-150", "America's best-selling full-size pickup truck.",
                2023, FuelType.GASOLINE, new BigDecimal("98"), null,
                TransmissionType.AUTOMATIC, 5, ford, truck
        );
        CarModel modelY = carModel(
                "Model Y", "A fully electric SUV with impressive range.",
                2024, FuelType.ELECTRIC, null, new BigDecimal("75"),
                TransmissionType.AUTOMATIC, 5, tesla, suv
        );
        CarModel model3 = carModel(
                "Model 3", "A sleek all-electric sedan with autopilot.",
                2024, FuelType.ELECTRIC, null, new BigDecimal("57.5"),
                TransmissionType.AUTOMATIC, 5, tesla, sedan
        );
        carModelRepository.saveAll(List.of(camry, corolla, rav4, civic, crv, f150, modelY, model3));
        log.info("Seeded {} car models", 8);

        // ── CARS ──────────────────────────────────────────────────────────────
        Car car1 = car("51A-12345", new BigDecimal("800000"),  new BigDecimal("5000000"),  CarStatus.AVAILABLE, camry);
        Car car2 = car("51B-67890", new BigDecimal("700000"),  new BigDecimal("4000000"),  CarStatus.AVAILABLE, corolla);
        Car car3 = car("51C-11111", new BigDecimal("950000"),  new BigDecimal("6000000"),  CarStatus.AVAILABLE, rav4);
        Car car4 = car("51D-22222", new BigDecimal("650000"),  new BigDecimal("3500000"),  CarStatus.AVAILABLE, civic);
        Car car5 = car("51E-33333", new BigDecimal("850000"),  new BigDecimal("5500000"),  CarStatus.STOPPED,   crv);
        Car car6 = car("51F-44444", new BigDecimal("1100000"), new BigDecimal("7000000"),  CarStatus.AVAILABLE, f150);
        Car car7 = car("51G-55555", new BigDecimal("1200000"), new BigDecimal("8000000"),  CarStatus.AVAILABLE, modelY);
        Car car8 = car("51H-66666", new BigDecimal("1050000"), new BigDecimal("7500000"),  CarStatus.BANNED,    model3);

        // Add images to cars
        addImage(car1, "https://cdn.motor1.com/images/mgl/nAGrzB/s3/2023-toyota-camry.jpg",         true);
        addImage(car1, "https://cdn.motor1.com/images/mgl/nAGrzB/s3/2023-toyota-camry-rear.jpg",    false);

        addImage(car2, "https://cdn.motor1.com/images/mgl/corolla/s3/2022-toyota-corolla.jpg",      true);

        addImage(car3, "https://cdn.motor1.com/images/mgl/rav4/s3/2023-toyota-rav4.jpg",            true);
        addImage(car3, "https://cdn.motor1.com/images/mgl/rav4/s3/2023-toyota-rav4-interior.jpg",   false);

        addImage(car4, "https://cdn.motor1.com/images/mgl/civic/s3/2023-honda-civic.jpg",           true);

        addImage(car5, "https://cdn.motor1.com/images/mgl/crv/s3/2022-honda-crv.jpg",               true);

        addImage(car6, "https://cdn.motor1.com/images/mgl/f150/s3/2023-ford-f150.jpg",              true);
        addImage(car6, "https://cdn.motor1.com/images/mgl/f150/s3/2023-ford-f150-bed.jpg",          false);

        addImage(car7, "https://cdn.motor1.com/images/mgl/modely/s3/2024-tesla-model-y.jpg",        true);
        addImage(car7, "https://cdn.motor1.com/images/mgl/modely/s3/2024-tesla-model-y-interior.jpg", false);

        addImage(car8, "https://cdn.motor1.com/images/mgl/model3/s3/2024-tesla-model-3.jpg",        true);

        carRepository.saveAll(List.of(car1, car2, car3, car4, car5, car6, car7, car8));
        log.info("Seeded {} cars", 8);

        log.info("Database seeding complete.");
    }

    // ── BUILDER HELPERS ───────────────────────────────────────────────────────

    private CarType carType(String typeName) {
        CarType t = new CarType();
        t.setTypeName(typeName);
        t.setCarModels(new HashSet<>());
        return t;
    }

    private CarBrand carBrand(String name, String logoUrl) {
        CarBrand b = new CarBrand();
        b.setName(name);
        b.setLogoUrl(logoUrl);
        b.setApprovalStatus(ApprovalStatus.APPROVED);
        b.setCarModels(new HashSet<>());
        return b;
    }

    private CarModel carModel(
            String name, String description,
            int year, FuelType fuelType,
            BigDecimal fuelCapacity, BigDecimal batteryCapacity,
            TransmissionType transmission, int seats,
            CarBrand brand, CarType type) {

        CarModel m = new CarModel();
        m.setName(name);
        m.setDescription(description);
        m.setYear(year);
        m.setFuelType(fuelType);
        m.setFuelCapacity(fuelCapacity);
        m.setBatteryCapacity(batteryCapacity);
        m.setTransmission(transmission);
        m.setSeats(seats);
        m.setApprovalStatus(ApprovalStatus.APPROVED);
        m.setBrand(brand);
        m.setType(type);
        m.setCars(new HashSet<>());
        return m;
    }

    private Car car(String licensePlate, BigDecimal basePricePerDay,
                    BigDecimal depositAmount, CarStatus status, CarModel carModel) {
        Car c = new Car();
        c.setLicensePlate(licensePlate);
        c.setBasePricePerDay(basePricePerDay);
        c.setDepositAmount(depositAmount);
        c.setStatus(status);
        c.setCarModel(carModel);
        c.setImages(new HashSet<>());
        return c;
    }

    private void addImage(Car car, String imageUrl, boolean isThumbnail) {
        CarImage img = new CarImage();
        img.setImageUrl(imageUrl);
        img.setIsThumbnail(isThumbnail);
        img.setCar(car);
        car.getImages().add(img);
    }
}
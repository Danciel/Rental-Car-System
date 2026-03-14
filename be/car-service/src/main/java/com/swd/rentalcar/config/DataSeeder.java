package com.swd.rentalcar.config;

import com.swd.rentalcar.client.UserServiceClient;
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
    private final UserServiceClient userServiceClient;

    @Override
    public void run(String... args) {
        if (carBrandRepository.count() > 0) {
            log.info("Database already seeded, skipping...");
            return;
        }

        // Fetch 2 Owner khác nhau từ User Service
        Long owner1Id = fetchOwnerId("owner@gmail.com");
        Long owner2Id = fetchOwnerId("pro@gmail.com");

        if (owner1Id == null || owner2Id == null) {
            log.warn("⚠️ Không tìm đủ 2 Owner, vui lòng chạy user-service seeder trước.");
            return;
        }

        seedCarTypes();
        seedCarBrands();
        seedCarModels();
        seedCars(owner1Id, owner2Id); // Truyền cả 2 ID vào để chia xe
        seedPendingReviewCars(owner1Id);
        logAllSeededCars();

        log.info("✅ Database seeding complete.");
    }

    // ═════════════════════════════════════════════════════════════════════════
    // FETCH OWNER
    // ═════════════════════════════════════════════════════════════════════════

    private Long fetchOwnerId(String email) {
        try {
            Long ownerId = userServiceClient.getOwnerIdByLogin(email, "123456");
            if (ownerId == null) {
                log.warn("⚠️ Owner not found: {}", email);
                return null;
            }
            log.info("✅ Fetched owner id for {}: {}", email, ownerId);
            return ownerId;
        } catch (Exception e) {
            log.error("❌ Failed to fetch owner id for {}: {}", email, e.getMessage());
            return null;
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // SEED CAR TYPES & BRANDS & MODELS (Giữ nguyên như cũ)
    // ═════════════════════════════════════════════════════════════════════════

    private void seedCarTypes() {
        try {
            List<CarType> types = List.of(
                    carType("Sedan"), carType("SUV"), carType("Hatchback"),
                    carType("Truck"), carType("Coupe"), carType("Convertible"),
                    carType("Minivan"), carType("Pickup")
            );
            carTypeRepository.saveAll(types);
        } catch (Exception e) { log.error("❌ Failed to seed car types: {}", e.getMessage()); }
    }

    private void seedCarBrands() {
        try {
            List<CarBrand> brands = List.of(
                    carBrand("Toyota", "https://logo.clearbit.com/toyota.com"),
                    carBrand("Honda", "https://logo.clearbit.com/honda.com"),
                    carBrand("Ford", "https://logo.clearbit.com/ford.com"),
                    carBrand("Tesla", "https://logo.clearbit.com/tesla.com"),
                    carBrand("Hyundai", "https://logo.clearbit.com/hyundai.com"),
                    carBrand("Kia", "https://logo.clearbit.com/kia.com"),
                    carBrand("Mazda", "https://logo.clearbit.com/mazda.com"),
                    carBrand("Mercedes", "https://logo.clearbit.com/mercedes-benz.com"),
                    carBrand("BMW", "https://logo.clearbit.com/bmw.com"),
                    carBrand("Vinfast", "https://logo.clearbit.com/vinfastauto.com")
            );
            carBrandRepository.saveAll(brands);
        } catch (Exception e) { log.error("❌ Failed to seed car brands: {}", e.getMessage()); }
    }

    private void seedCarModels() {
        try {
            CarBrand toyota   = carBrandRepository.findByName("Toyota");
            CarBrand honda    = carBrandRepository.findByName("Honda");
            CarBrand ford     = carBrandRepository.findByName("Ford");
            CarBrand tesla    = carBrandRepository.findByName("Tesla");
            CarBrand hyundai  = carBrandRepository.findByName("Hyundai");
            CarBrand kia      = carBrandRepository.findByName("Kia");
            CarBrand mazda    = carBrandRepository.findByName("Mazda");
            CarBrand mercedes = carBrandRepository.findByName("Mercedes");
            CarBrand bmw      = carBrandRepository.findByName("BMW");
            CarBrand vinfast  = carBrandRepository.findByName("Vinfast");

            CarType sedan     = carTypeRepository.findByTypeName("Sedan");
            CarType suv       = carTypeRepository.findByTypeName("SUV");
            CarType hatchback = carTypeRepository.findByTypeName("Hatchback");
            CarType pickup    = carTypeRepository.findByTypeName("Pickup");
            CarType minivan   = carTypeRepository.findByTypeName("Minivan");

            List<CarModel> models = List.of(
                    carModel("Camry", "Sedan hạng trung", 2023, FuelType.GASOLINE, new BigDecimal("70"), null, TransmissionType.AUTOMATIC, 5, toyota, sedan),
                    carModel("Corolla", "Sedan compact", 2022, FuelType.HYBRID, new BigDecimal("50"), new BigDecimal("8.8"), TransmissionType.AUTOMATIC, 5, toyota, sedan),
                    carModel("RAV4", "SUV đa dụng", 2023, FuelType.HYBRID, new BigDecimal("55"), new BigDecimal("18.1"), TransmissionType.AUTOMATIC, 5, toyota, suv),
                    carModel("Fortuner", "SUV 7 chỗ", 2023, FuelType.DIESEL, new BigDecimal("80"), null, TransmissionType.AUTOMATIC, 7, toyota, suv),
                    carModel("Innova", "Minivan 8 chỗ", 2022, FuelType.GASOLINE, new BigDecimal("55"), null, TransmissionType.AUTOMATIC, 8, toyota, minivan),
                    carModel("Vios", "Sedan hạng B", 2023, FuelType.GASOLINE, new BigDecimal("42"), null, TransmissionType.AUTOMATIC, 5, toyota, sedan),
                    carModel("Civic", "Hatchback thể thao", 2023, FuelType.GASOLINE, new BigDecimal("47"), null, TransmissionType.MANUAL, 5, honda, hatchback),
                    carModel("CR-V", "SUV gia đình", 2022, FuelType.GASOLINE, new BigDecimal("57"), null, TransmissionType.AUTOMATIC, 5, honda, suv),
                    carModel("City", "Sedan hạng B", 2023, FuelType.GASOLINE, new BigDecimal("40"), null, TransmissionType.CVT, 5, honda, sedan),
                    carModel("HR-V", "SUV đô thị", 2023, FuelType.GASOLINE, new BigDecimal("40"), null, TransmissionType.CVT, 5, honda, suv),
                    carModel("F-150", "Bán tải cỡ lớn", 2023, FuelType.GASOLINE, new BigDecimal("98"), null, TransmissionType.AUTOMATIC, 5, ford, pickup),
                    carModel("Ranger", "Bán tải hạng trung", 2023, FuelType.DIESEL, new BigDecimal("80"), null, TransmissionType.AUTOMATIC, 5, ford, pickup),
                    carModel("Model Y", "SUV điện", 2024, FuelType.ELECTRIC, null, new BigDecimal("75"), TransmissionType.AUTOMATIC, 5, tesla, suv),
                    carModel("Model 3", "Sedan điện", 2024, FuelType.ELECTRIC, null, new BigDecimal("57.5"), TransmissionType.AUTOMATIC, 5, tesla, sedan),
                    carModel("Tucson", "SUV đô thị", 2023, FuelType.GASOLINE, new BigDecimal("54"), null, TransmissionType.AUTOMATIC, 5, hyundai, suv),
                    carModel("Ioniq 5", "SUV điện", 2024, FuelType.ELECTRIC, null, new BigDecimal("72.6"), TransmissionType.AUTOMATIC, 5, hyundai, suv),
                    carModel("Seltos", "SUV đô thị cỡ nhỏ", 2023, FuelType.GASOLINE, new BigDecimal("50"), null, TransmissionType.AUTOMATIC, 5, kia, suv),
                    carModel("Mazda3", "Sedan Kodo", 2023, FuelType.GASOLINE, new BigDecimal("51"), null, TransmissionType.AUTOMATIC, 5, mazda, sedan),
                    carModel("CX-5", "SUV 5 chỗ", 2023, FuelType.GASOLINE, new BigDecimal("58"), null, TransmissionType.AUTOMATIC, 5, mazda, suv),
                    carModel("C-Class", "Sedan hạng sang", 2023, FuelType.GASOLINE, new BigDecimal("66"), null, TransmissionType.AUTOMATIC, 5, mercedes, sedan),
                    carModel("3 Series", "Sedan thể thao", 2023, FuelType.GASOLINE, new BigDecimal("59"), null, TransmissionType.AUTOMATIC, 5, bmw, sedan),
                    carModel("VF 6", "SUV điện hạng B", 2024, FuelType.ELECTRIC, null, new BigDecimal("59.6"), TransmissionType.AUTOMATIC, 5, vinfast, suv),
                    carModel("VF 8", "SUV điện hạng C", 2024, FuelType.ELECTRIC, null, new BigDecimal("82"), TransmissionType.AUTOMATIC, 5, vinfast, suv),
                    // Ford
                    carModel("Explorer", "SUV 7 chỗ cỡ lớn, mạnh mẽ.",         2022, FuelType.GASOLINE, new BigDecimal("72"),  null,                  TransmissionType.AUTOMATIC, 7, ford,    suv),
                    carModel("Everest",  "SUV 7 chỗ địa hình, phù hợp gia đình.", 2023, FuelType.DIESEL, new BigDecimal("80"),  null,                  TransmissionType.AUTOMATIC, 7, ford,    suv),
                    // Tesla
                    carModel("Model X",  "SUV điện cao cấp với cửa cánh chim.", 2024, FuelType.ELECTRIC, null,                  new BigDecimal("100"), TransmissionType.AUTOMATIC, 7, tesla,   suv),
                    // Hyundai
                    carModel("Santa Fe", "SUV 7 chỗ sang trọng, phù hợp gia đình.", 2023, FuelType.GASOLINE, new BigDecimal("67"), null,               TransmissionType.AUTOMATIC, 7, hyundai, suv),
                    // Kia
                    carModel("Sorento",  "SUV 7 chỗ cao cấp, nhiều trang bị an toàn.", 2023, FuelType.GASOLINE, new BigDecimal("67"), null,            TransmissionType.AUTOMATIC, 7, kia,     suv)
            );
            carModelRepository.saveAll(models);
        } catch (Exception e) { log.error("❌ Failed to seed car models: {}", e.getMessage()); }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // SEED CARS - ĐÃ CHIA CHO 2 OWNER KHÁC NHAU
    // ═════════════════════════════════════════════════════════════════════════

    private void seedCars(Long owner1Id, Long owner2Id) {
        try {
            CarModel camry    = carModelRepository.findByName("Camry");
            CarModel corolla  = carModelRepository.findByName("Corolla");
            CarModel rav4     = carModelRepository.findByName("RAV4");
            CarModel fortuner = carModelRepository.findByName("Fortuner");
            CarModel innova   = carModelRepository.findByName("Innova");
            CarModel vios     = carModelRepository.findByName("Vios");
            CarModel civic    = carModelRepository.findByName("Civic");
            CarModel crv      = carModelRepository.findByName("CR-V");
            CarModel city     = carModelRepository.findByName("City");
            CarModel hrv      = carModelRepository.findByName("HR-V");
            CarModel f150     = carModelRepository.findByName("F-150");
            CarModel ranger   = carModelRepository.findByName("Ranger");
            CarModel modelY   = carModelRepository.findByName("Model Y");
            CarModel model3   = carModelRepository.findByName("Model 3");
            CarModel tucson   = carModelRepository.findByName("Tucson");
            CarModel ioniq5   = carModelRepository.findByName("Ioniq 5");
            CarModel seltos   = carModelRepository.findByName("Seltos");
            CarModel mazda3   = carModelRepository.findByName("Mazda3");
            CarModel cx5      = carModelRepository.findByName("CX-5");
            CarModel cClass   = carModelRepository.findByName("C-Class");
            CarModel series3  = carModelRepository.findByName("3 Series");
            CarModel vf6      = carModelRepository.findByName("VF 6");
            CarModel vf8      = carModelRepository.findByName("VF 8");

            List<Car> cars = List.of(
                    // Toyota -> Gán cho Owner 1
                    buildCar("51A-10001", "800000",  "5000000",  CarStatus.AVAILABLE, camry,    owner1Id),
                    buildCar("51A-10002", "800000",  "5000000",  CarStatus.AVAILABLE, camry,    owner1Id),
                    buildCar("51B-20001", "700000",  "4000000",  CarStatus.AVAILABLE, corolla,  owner1Id),
                    buildCar("51C-30001", "950000",  "6000000",  CarStatus.AVAILABLE, rav4,     owner1Id),
                    buildCar("51C-30002", "950000",  "6000000",  CarStatus.STOPPED,   rav4,     owner1Id),
                    buildCar("51D-40001", "1050000", "7000000",  CarStatus.AVAILABLE, fortuner, owner1Id),
                    buildCar("51D-40002", "1050000", "7000000",  CarStatus.AVAILABLE, fortuner, owner1Id),
                    buildCar("51E-50001", "850000",  "5500000",  CarStatus.AVAILABLE, innova,   owner1Id),
                    buildCar("51F-60001", "600000",  "3500000",  CarStatus.AVAILABLE, vios,     owner1Id),
                    buildCar("51F-60002", "600000",  "3500000",  CarStatus.AVAILABLE, vios,     owner1Id),

                    // Honda -> Gán cho Owner 2
                    buildCar("51G-70001", "650000",  "3500000",  CarStatus.AVAILABLE, civic,    owner2Id),
                    buildCar("51H-80001", "850000",  "5500000",  CarStatus.AVAILABLE, crv,      owner2Id),
                    buildCar("51H-80002", "850000",  "5500000",  CarStatus.BANNED,    crv,      owner2Id),
                    buildCar("51K-90001", "580000",  "3200000",  CarStatus.AVAILABLE, city,     owner2Id),
                    buildCar("51K-90002", "580000",  "3200000",  CarStatus.AVAILABLE, city,     owner2Id),
                    buildCar("51L-10001", "720000",  "4500000",  CarStatus.AVAILABLE, hrv,      owner2Id),

                    // Ford -> Gán cho Owner 1
                    buildCar("51M-20001", "1100000", "7000000",  CarStatus.AVAILABLE, f150,     owner1Id),
                    buildCar("51N-30001", "900000",  "6000000",  CarStatus.AVAILABLE, ranger,   owner1Id),
                    buildCar("51N-30002", "900000",  "6000000",  CarStatus.STOPPED,   ranger,   owner1Id),

                    // Tesla, Hyundai, Kia, Mazda, Luxury, Vinfast -> Gán cho Owner 2
                    buildCar("51P-40001", "1200000", "8000000",  CarStatus.AVAILABLE, modelY,   owner2Id),
                    buildCar("51P-40002", "1200000", "8000000",  CarStatus.AVAILABLE, modelY,   owner2Id),
                    buildCar("51Q-50001", "1050000", "7500000",  CarStatus.AVAILABLE, model3,   owner2Id),
                    buildCar("51R-60001", "780000",  "5000000",  CarStatus.AVAILABLE, tucson,   owner2Id),
                    buildCar("51S-70001", "1300000", "9000000",  CarStatus.AVAILABLE, ioniq5,   owner2Id),
                    buildCar("51T-80001", "700000",  "4500000",  CarStatus.AVAILABLE, seltos,   owner2Id),
                    buildCar("51U-90001", "750000",  "4800000",  CarStatus.AVAILABLE, mazda3,   owner2Id),
                    buildCar("51V-10001", "880000",  "5800000",  CarStatus.AVAILABLE, cx5,      owner2Id),
                    buildCar("51X-20001", "2500000", "15000000", CarStatus.AVAILABLE, cClass,   owner2Id),
                    buildCar("51Y-30001", "2200000", "14000000", CarStatus.AVAILABLE, series3,  owner2Id),
                    buildCar("51Z-40001", "750000",  "4500000",  CarStatus.AVAILABLE, vf6,      owner2Id),
                    buildCar("51Z-40002", "750000",  "4500000",  CarStatus.AVAILABLE, vf6,      owner2Id),
                    buildCar("51Z-50001", "950000",  "6000000",  CarStatus.AVAILABLE, vf8,      owner2Id)
            );

            // Add Thumbnail image
            addImage(cars.get(0),  "/images/cars/toyota-camry.jpg",      true);
            addImage(cars.get(1),  "/images/cars/toyota-camry.jpg",      true);
            addImage(cars.get(2),  "/images/cars/toyota-corolla.jpg",    true);
            addImage(cars.get(3),  "/images/cars/toyota-rav4.jpg",       true);
            addImage(cars.get(4),  "/images/cars/toyota-rav4.jpg",       true);
            addImage(cars.get(5),  "/images/cars/toyota-fortuner.jpg",   true);
            addImage(cars.get(6),  "/images/cars/toyota-fortuner.jpg",   true);
            addImage(cars.get(7),  "/images/cars/toyota-innova.jpg",     true);
            addImage(cars.get(8),  "/images/cars/toyota-vios.jpg",       true);
            addImage(cars.get(9),  "/images/cars/toyota-vios.jpg",       true);
            addImage(cars.get(10), "/images/cars/honda-civic.jpg",       true);
            addImage(cars.get(11), "/images/cars/honda-crv.jpg",         true);
            addImage(cars.get(12), "/images/cars/honda-crv.jpg",         true);
            addImage(cars.get(13), "/images/cars/honda-city.jpg",        true);
            addImage(cars.get(14), "/images/cars/honda-city.jpg",        true);
            addImage(cars.get(15), "/images/cars/honda-hrv.jpg",         true);
            addImage(cars.get(16), "/images/cars/ford-f150.jpg",         true);
            addImage(cars.get(17), "/images/cars/ford-ranger.jpg",       true);
            addImage(cars.get(18), "/images/cars/ford-ranger.jpg",       true);
            addImage(cars.get(19), "/images/cars/tesla-model-y.jpg",     true);
            addImage(cars.get(20), "/images/cars/tesla-model-y.jpg",     true);
            addImage(cars.get(21), "/images/cars/tesla-model-3.jpg",     true);
            addImage(cars.get(22), "/images/cars/hyundai-tucson.jpg",    true);
            addImage(cars.get(23), "/images/cars/hyundai-ioniq.jpg",     true);
            addImage(cars.get(24), "/images/cars/kia-seltos.jpg",        true);
            addImage(cars.get(25), "/images/cars/mazda3.jpg",            true);
            addImage(cars.get(26), "/images/cars/mazda-cx5.jpg",         true);
            addImage(cars.get(27), "/images/cars/mercedes-c-class.jpg",  true);
            addImage(cars.get(28), "/images/cars/bmw-3series.jpg",       true);
            addImage(cars.get(29), "/images/cars/vinfast-vf6.jpg",       true);
            addImage(cars.get(30), "/images/cars/vinfast-vf6.jpg",       true);
            addImage(cars.get(31), "/images/cars/vinfast-vf8.jpg",       true);

            carRepository.saveAll(cars);
            log.info("✅ Seeded {} cars", cars.size());
        } catch (Exception e) {
            log.error("❌ Failed to seed cars: {}", e.getMessage());
        }
    }

    private void seedPendingReviewCars(Long ownerId) {
        // ── PENDING REVIEW (for testing Car Registration approval flow) ──────────
        CarModel explorer = carModelRepository.findByName("Explorer");
        CarModel everest  = carModelRepository.findByName("Everest");
        CarModel modelX   = carModelRepository.findByName("Model X");
        CarModel santafe  = carModelRepository.findByName("Santa Fe");
        CarModel sorento  = carModelRepository.findByName("Sorento");

        List<Car> pendingCars = List.of(
                buildCar("30A-99001", "1100000", "7000000", CarStatus.STOPPED, explorer, ownerId),
                buildCar("30B-99002", "1050000", "7000000", CarStatus.STOPPED, everest,  ownerId),
                buildCar("30C-99003", "1500000", "10000000",CarStatus.STOPPED, modelX,   ownerId),
                buildCar("30D-99004", "950000",  "6000000", CarStatus.STOPPED, santafe,  ownerId),
                buildCar("30E-99005", "880000",  "5800000", CarStatus.STOPPED, sorento,  ownerId)
        );

        addImage(pendingCars.get(0), "/images/cars/ford-ranger.jpg",      true);
        addImage(pendingCars.get(1), "/images/cars/ford-ranger.jpg",      true);
        addImage(pendingCars.get(2), "/images/cars/tesla-model-y.jpg",    true);
        addImage(pendingCars.get(3), "/images/cars/hyundai-tucson.jpg",   true);
        addImage(pendingCars.get(4), "/images/cars/kia-seltos.jpg",       true);

        carRepository.saveAll(pendingCars);
        log.info("✅ Seeded {} pending review cars", pendingCars.size());
    }

    private void logAllSeededCars(){
        List<Car> cars = carRepository.findAll();
        log.info("✅ Seeded {} cars ({} available, {} pending review)",
                cars.size(),
                cars.stream().filter(c -> c.getStatus() == CarStatus.AVAILABLE).count(),
                cars.stream().filter(c -> c.getStatus() == CarStatus.STOPPED).count()
        );
    }

    // ═════════════════════════════════════════════════════════════════════════
    // BUILDER HELPERS
    // ═════════════════════════════════════════════════════════════════════════

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

    private CarModel carModel(String name, String description, int year,
                              FuelType fuelType, BigDecimal fuelCapacity, BigDecimal batteryCapacity,
                              TransmissionType transmission, int seats, CarBrand brand, CarType type) {
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

    private Car buildCar(String licensePlate, String basePrice, String deposit,
                         CarStatus status, CarModel carModel, Long ownerId) {
        Car c = new Car();
        c.setLicensePlate(licensePlate);
        c.setBasePricePerDay(new BigDecimal(basePrice));
        c.setDepositAmount(new BigDecimal(deposit));
        c.setStatus(status);
        c.setCarModel(carModel);
        c.setOwnerId(ownerId);
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
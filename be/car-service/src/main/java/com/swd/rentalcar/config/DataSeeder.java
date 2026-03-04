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

        Long ownerId = fetchOwnerId();
        if (ownerId == null) return;

        seedCarTypes();
        seedCarBrands();
        seedCarModels();
        seedCars(ownerId);

        log.info("✅ Database seeding complete.");
    }

    // ═════════════════════════════════════════════════════════════════════════
    // FETCH OWNER
    // ═════════════════════════════════════════════════════════════════════════

    private Long fetchOwnerId() {
        try {
            Long ownerId = userServiceClient.getOwnerIdByLogin("owner@gmail.com", "123456");
            if (ownerId == null) {
                log.warn("⚠️ Owner not found — make sure user-service is running and seeded first.");
                return null;
            }
            log.info("✅ Fetched owner id: {}", ownerId);
            return ownerId;
        } catch (Exception e) {
            log.error("❌ Failed to fetch owner id: {}", e.getMessage());
            return null;
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // SEED CAR TYPES
    // ═════════════════════════════════════════════════════════════════════════

    private void seedCarTypes() {
        try {
            List<CarType> types = List.of(
                    carType("Sedan"),
                    carType("SUV"),
                    carType("Hatchback"),
                    carType("Truck"),
                    carType("Coupe"),
                    carType("Convertible"),
                    carType("Minivan"),
                    carType("Pickup")
            );
            carTypeRepository.saveAll(types);
            log.info("✅ Seeded {} car types", types.size());
        } catch (Exception e) {
            log.error("❌ Failed to seed car types: {}", e.getMessage());
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // SEED CAR BRANDS
    // ═════════════════════════════════════════════════════════════════════════

    private void seedCarBrands() {
        try {
            List<CarBrand> brands = List.of(
                    carBrand("Toyota",      "https://logo.clearbit.com/toyota.com"),
                    carBrand("Honda",       "https://logo.clearbit.com/honda.com"),
                    carBrand("Ford",        "https://logo.clearbit.com/ford.com"),
                    carBrand("Tesla",       "https://logo.clearbit.com/tesla.com"),
                    carBrand("Hyundai",     "https://logo.clearbit.com/hyundai.com"),
                    carBrand("Kia",         "https://logo.clearbit.com/kia.com"),
                    carBrand("Mazda",       "https://logo.clearbit.com/mazda.com"),
                    carBrand("Mercedes",    "https://logo.clearbit.com/mercedes-benz.com"),
                    carBrand("BMW",         "https://logo.clearbit.com/bmw.com"),
                    carBrand("Vinfast",     "https://logo.clearbit.com/vinfastauto.com")
            );
            carBrandRepository.saveAll(brands);
            log.info("✅ Seeded {} car brands", brands.size());
        } catch (Exception e) {
            log.error("❌ Failed to seed car brands: {}", e.getMessage());
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // SEED CAR MODELS
    // ═════════════════════════════════════════════════════════════════════════

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
            CarType truck     = carTypeRepository.findByTypeName("Truck");
            CarType coupe     = carTypeRepository.findByTypeName("Coupe");
            CarType minivan   = carTypeRepository.findByTypeName("Minivan");
            CarType pickup    = carTypeRepository.findByTypeName("Pickup");

            List<CarModel> models = List.of(
                    // Toyota
                    carModel("Camry",       "Sedan hạng trung đáng tin cậy, thoải mái.",                      2023, FuelType.GASOLINE, new BigDecimal("70"),   null,                  TransmissionType.AUTOMATIC,    5, toyota,   sedan),
                    carModel("Corolla",     "Sedan compact tiết kiệm nhiên liệu.",                             2022, FuelType.HYBRID,   new BigDecimal("50"),   new BigDecimal("8.8"), TransmissionType.AUTOMATIC,    5, toyota,   sedan),
                    carModel("RAV4",        "SUV đa dụng, rộng rãi, phù hợp mọi địa hình.",                  2023, FuelType.HYBRID,   new BigDecimal("55"),   new BigDecimal("18.1"),TransmissionType.AUTOMATIC,    5, toyota,   suv),
                    carModel("Fortuner",    "SUV 7 chỗ mạnh mẽ, phổ biến tại Việt Nam.",                     2023, FuelType.DIESEL,   new BigDecimal("80"),   null,                  TransmissionType.AUTOMATIC,    7, toyota,   suv),
                    carModel("Innova",      "Minivan 8 chỗ lý tưởng cho gia đình.",                           2022, FuelType.GASOLINE, new BigDecimal("55"),   null,                  TransmissionType.AUTOMATIC,    8, toyota,   minivan),
                    carModel("Vios",        "Sedan hạng B tiết kiệm, phù hợp đô thị.",                        2023, FuelType.GASOLINE, new BigDecimal("42"),   null,                  TransmissionType.AUTOMATIC,    5, toyota,   sedan),

                    // Honda
                    carModel("Civic",       "Hatchback thể thao, tiết kiệm nhiên liệu.",                      2023, FuelType.GASOLINE, new BigDecimal("47"),   null,                  TransmissionType.MANUAL,       5, honda,    hatchback),
                    carModel("CR-V",        "SUV gia đình thực dụng, khoang hành lý rộng.",                   2022, FuelType.GASOLINE, new BigDecimal("57"),   null,                  TransmissionType.AUTOMATIC,    5, honda,    suv),
                    carModel("City",        "Sedan hạng B bán chạy nhất Việt Nam.",                            2023, FuelType.GASOLINE, new BigDecimal("40"),   null,                  TransmissionType.CVT,          5, honda,    sedan),
                    carModel("HR-V",        "SUV đô thị cỡ nhỏ, thiết kế trẻ trung.",                        2023, FuelType.GASOLINE, new BigDecimal("40"),   null,                  TransmissionType.CVT,          5, honda,    suv),

                    // Ford
                    carModel("F-150",       "Bán tải cỡ lớn bán chạy nhất nước Mỹ.",                         2023, FuelType.GASOLINE, new BigDecimal("98"),   null,                  TransmissionType.AUTOMATIC,    5, ford,     pickup),
                    carModel("Ranger",      "Bán tải hạng trung phổ biến tại Việt Nam.",                      2023, FuelType.DIESEL,   new BigDecimal("80"),   null,                  TransmissionType.AUTOMATIC,    5, ford,     pickup),
                    carModel("Explorer",    "SUV 7 chỗ cỡ lớn, mạnh mẽ.",                                    2022, FuelType.GASOLINE, new BigDecimal("72"),   null,                  TransmissionType.AUTOMATIC,    7, ford,     suv),
                    carModel("Everest",     "SUV 7 chỗ địa hình, phù hợp gia đình.",                          2023, FuelType.DIESEL,   new BigDecimal("80"),   null,                  TransmissionType.AUTOMATIC,    7, ford,     suv),

                    // Tesla
                    carModel("Model Y",     "SUV điện hạng trung, phạm vi hoạt động ấn tượng.",               2024, FuelType.ELECTRIC, null,                  new BigDecimal("75"),  TransmissionType.AUTOMATIC,    5, tesla,    suv),
                    carModel("Model 3",     "Sedan điện thiết kế thanh lịch, có autopilot.",                  2024, FuelType.ELECTRIC, null,                  new BigDecimal("57.5"),TransmissionType.AUTOMATIC,    5, tesla,    sedan),
                    carModel("Model X",     "SUV điện cao cấp với cửa cánh chim.",                            2024, FuelType.ELECTRIC, null,                  new BigDecimal("100"), TransmissionType.AUTOMATIC,    7, tesla,    suv),

                    // Hyundai
                    carModel("Tucson",      "SUV đô thị thiết kế hiện đại, nhiều công nghệ.",                 2023, FuelType.GASOLINE, new BigDecimal("54"),   null,                  TransmissionType.AUTOMATIC,    5, hyundai,  suv),
                    carModel("Santa Fe",    "SUV 7 chỗ sang trọng, phù hợp gia đình.",                        2023, FuelType.GASOLINE, new BigDecimal("67"),   null,                  TransmissionType.AUTOMATIC,    7, hyundai,  suv),
                    carModel("Accent",      "Sedan hạng B giá tốt, tiết kiệm nhiên liệu.",                    2022, FuelType.GASOLINE, new BigDecimal("43"),   null,                  TransmissionType.AUTOMATIC,    5, hyundai,  sedan),
                    carModel("Ioniq 5",     "SUV điện tầm trung, sạc nhanh DC.",                              2024, FuelType.ELECTRIC, null,                  new BigDecimal("72.6"),TransmissionType.AUTOMATIC,    5, hyundai,  suv),

                    // Kia
                    carModel("Seltos",      "SUV đô thị cỡ nhỏ phong cách, giá hợp lý.",                     2023, FuelType.GASOLINE, new BigDecimal("50"),   null,                  TransmissionType.AUTOMATIC,    5, kia,      suv),
                    carModel("Sorento",     "SUV 7 chỗ cao cấp, nhiều trang bị an toàn.",                     2023, FuelType.GASOLINE, new BigDecimal("67"),   null,                  TransmissionType.AUTOMATIC,    7, kia,      suv),
                    carModel("K3",          "Sedan hạng C thể thao, tiện nghi.",                               2022, FuelType.GASOLINE, new BigDecimal("50"),   null,                  TransmissionType.AUTOMATIC,    5, kia,      sedan),
                    carModel("Carnival",    "Minivan cao cấp 8 chỗ, tiện nghi như phòng khách.",               2023, FuelType.GASOLINE, new BigDecimal("70"),   null,                  TransmissionType.AUTOMATIC,    8, kia,      minivan),

                    // Mazda
                    carModel("Mazda3",      "Sedan/hatchback thiết kế Kodo tinh tế.",                         2023, FuelType.GASOLINE, new BigDecimal("51"),   null,                  TransmissionType.AUTOMATIC,    5, mazda,    sedan),
                    carModel("CX-5",        "SUV 5 chỗ bán chạy, nội thất cao cấp.",                          2023, FuelType.GASOLINE, new BigDecimal("58"),   null,                  TransmissionType.AUTOMATIC,    5, mazda,    suv),
                    carModel("CX-8",        "SUV 7 chỗ sang trọng của Mazda.",                                 2022, FuelType.GASOLINE, new BigDecimal("62"),   null,                  TransmissionType.AUTOMATIC,    7, mazda,    suv),

                    // Mercedes
                    carModel("C-Class",     "Sedan hạng sang cỡ nhỏ, biểu tượng thành đạt.",                  2023, FuelType.GASOLINE, new BigDecimal("66"),   null,                  TransmissionType.AUTOMATIC,    5, mercedes, sedan),
                    carModel("GLC",         "SUV hạng sang cỡ trung, tiện nghi vượt trội.",                    2023, FuelType.GASOLINE, new BigDecimal("64"),   null,                  TransmissionType.AUTOMATIC,    5, mercedes, suv),
                    carModel("E-Class",     "Sedan hạng sang cỡ trung, đẳng cấp doanh nhân.",                  2022, FuelType.GASOLINE, new BigDecimal("66"),   null,                  TransmissionType.AUTOMATIC,    5, mercedes, sedan),

                    // BMW
                    carModel("3 Series",    "Sedan thể thao hạng sang, cảm giác lái tuyệt vời.",               2023, FuelType.GASOLINE, new BigDecimal("59"),   null,                  TransmissionType.AUTOMATIC,    5, bmw,      sedan),
                    carModel("X5",          "SUV hạng sang cỡ lớn, mạnh mẽ sang trọng.",                       2023, FuelType.GASOLINE, new BigDecimal("83"),   null,                  TransmissionType.AUTOMATIC,    5, bmw,      suv),
                    carModel("5 Series",    "Sedan hạng sang cỡ trung, cân bằng hoàn hảo.",                    2022, FuelType.GASOLINE, new BigDecimal("68"),   null,                  TransmissionType.AUTOMATIC,    5, bmw,      sedan),

                    // Vinfast
                    carModel("VF 5",        "SUV điện cỡ nhỏ, thương hiệu Việt Nam.",                         2024, FuelType.ELECTRIC, null,                  new BigDecimal("37.5"),TransmissionType.AUTOMATIC,    5, vinfast,  suv),
                    carModel("VF 6",        "SUV điện hạng B, phạm vi 400km.",                                 2024, FuelType.ELECTRIC, null,                  new BigDecimal("59.6"),TransmissionType.AUTOMATIC,    5, vinfast,  suv),
                    carModel("VF 8",        "SUV điện hạng C, trang bị hiện đại.",                             2024, FuelType.ELECTRIC, null,                  new BigDecimal("82"),  TransmissionType.AUTOMATIC,    5, vinfast,  suv),
                    carModel("VF 9",        "SUV điện 7 chỗ cỡ lớn, niềm tự hào Việt.",                       2024, FuelType.ELECTRIC, null,                  new BigDecimal("123"), TransmissionType.AUTOMATIC,    7, vinfast,  suv)
            );

            carModelRepository.saveAll(models);
            log.info("✅ Seeded {} car models", models.size());
        } catch (Exception e) {
            log.error("❌ Failed to seed car models: {}", e.getMessage());
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // SEED CARS
    // ═════════════════════════════════════════════════════════════════════════

    private void seedCars(Long ownerId) {
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
                    // Toyota
                    buildCar("51A-10001", "800000",  "5000000",  CarStatus.AVAILABLE, camry,    ownerId),
                    buildCar("51A-10002", "800000",  "5000000",  CarStatus.AVAILABLE, camry,    ownerId),
                    buildCar("51B-20001", "700000",  "4000000",  CarStatus.AVAILABLE, corolla,  ownerId),
                    buildCar("51C-30001", "950000",  "6000000",  CarStatus.AVAILABLE, rav4,     ownerId),
                    buildCar("51C-30002", "950000",  "6000000",  CarStatus.STOPPED,   rav4,     ownerId),
                    buildCar("51D-40001", "1050000", "7000000",  CarStatus.AVAILABLE, fortuner, ownerId),
                    buildCar("51D-40002", "1050000", "7000000",  CarStatus.AVAILABLE, fortuner, ownerId),
                    buildCar("51E-50001", "850000",  "5500000",  CarStatus.AVAILABLE, innova,   ownerId),
                    buildCar("51F-60001", "600000",  "3500000",  CarStatus.AVAILABLE, vios,     ownerId),
                    buildCar("51F-60002", "600000",  "3500000",  CarStatus.AVAILABLE, vios,     ownerId),

                    // Honda
                    buildCar("51G-70001", "650000",  "3500000",  CarStatus.AVAILABLE, civic,    ownerId),
                    buildCar("51H-80001", "850000",  "5500000",  CarStatus.AVAILABLE, crv,      ownerId),
                    buildCar("51H-80002", "850000",  "5500000",  CarStatus.BANNED,    crv,      ownerId),
                    buildCar("51K-90001", "580000",  "3200000",  CarStatus.AVAILABLE, city,     ownerId),
                    buildCar("51K-90002", "580000",  "3200000",  CarStatus.AVAILABLE, city,     ownerId),
                    buildCar("51L-10001", "720000",  "4500000",  CarStatus.AVAILABLE, hrv,      ownerId),

                    // Ford
                    buildCar("51M-20001", "1100000", "7000000",  CarStatus.AVAILABLE, f150,     ownerId),
                    buildCar("51N-30001", "900000",  "6000000",  CarStatus.AVAILABLE, ranger,   ownerId),
                    buildCar("51N-30002", "900000",  "6000000",  CarStatus.STOPPED,   ranger,   ownerId),

                    // Tesla
                    buildCar("51P-40001", "1200000", "8000000",  CarStatus.AVAILABLE, modelY,   ownerId),
                    buildCar("51P-40002", "1200000", "8000000",  CarStatus.AVAILABLE, modelY,   ownerId),
                    buildCar("51Q-50001", "1050000", "7500000",  CarStatus.AVAILABLE, model3,   ownerId),

                    // Hyundai
                    buildCar("51R-60001", "780000",  "5000000",  CarStatus.AVAILABLE, tucson,   ownerId),
                    buildCar("51S-70001", "1300000", "9000000",  CarStatus.AVAILABLE, ioniq5,   ownerId),

                    // Kia & Mazda
                    buildCar("51T-80001", "700000",  "4500000",  CarStatus.AVAILABLE, seltos,   ownerId),
                    buildCar("51U-90001", "750000",  "4800000",  CarStatus.AVAILABLE, mazda3,   ownerId),
                    buildCar("51V-10001", "880000",  "5800000",  CarStatus.AVAILABLE, cx5,      ownerId),

                    // Luxury
                    buildCar("51X-20001", "2500000", "15000000", CarStatus.AVAILABLE, cClass,   ownerId),
                    buildCar("51Y-30001", "2200000", "14000000", CarStatus.AVAILABLE, series3,  ownerId),

                    // Vinfast
                    buildCar("51Z-40001", "750000",  "4500000",  CarStatus.AVAILABLE, vf6,      ownerId),
                    buildCar("51Z-40002", "750000",  "4500000",  CarStatus.AVAILABLE, vf6,      ownerId),
                    buildCar("51Z-50001", "950000",  "6000000",  CarStatus.AVAILABLE, vf8,      ownerId)
            );

            // Add thumbnail images
            addImage(cars.get(0),  "https://cdn.motor1.com/images/mgl/nAGrzB/s3/2023-toyota-camry.jpg",           true);
            addImage(cars.get(0),  "https://cdn.motor1.com/images/mgl/nAGrzB/s3/2023-toyota-camry-rear.jpg",      false);
            addImage(cars.get(1),  "https://cdn.motor1.com/images/mgl/nAGrzB/s3/2023-toyota-camry.jpg",           true);
            addImage(cars.get(2),  "https://cdn.motor1.com/images/mgl/corolla/s3/2022-toyota-corolla.jpg",        true);
            addImage(cars.get(3),  "https://cdn.motor1.com/images/mgl/rav4/s3/2023-toyota-rav4.jpg",              true);
            addImage(cars.get(3),  "https://cdn.motor1.com/images/mgl/rav4/s3/2023-toyota-rav4-interior.jpg",     false);
            addImage(cars.get(4),  "https://cdn.motor1.com/images/mgl/rav4/s3/2023-toyota-rav4.jpg",              true);
            addImage(cars.get(5),  "https://cdn.motor1.com/images/mgl/fortuner/s3/2023-toyota-fortuner.jpg",      true);
            addImage(cars.get(6),  "https://cdn.motor1.com/images/mgl/fortuner/s3/2023-toyota-fortuner.jpg",      true);
            addImage(cars.get(7),  "https://cdn.motor1.com/images/mgl/innova/s3/2022-toyota-innova.jpg",          true);
            addImage(cars.get(8),  "https://cdn.motor1.com/images/mgl/vios/s3/2023-toyota-vios.jpg",              true);
            addImage(cars.get(9),  "https://cdn.motor1.com/images/mgl/vios/s3/2023-toyota-vios.jpg",              true);
            addImage(cars.get(10), "https://cdn.motor1.com/images/mgl/civic/s3/2023-honda-civic.jpg",             true);
            addImage(cars.get(11), "https://cdn.motor1.com/images/mgl/crv/s3/2022-honda-crv.jpg",                 true);
            addImage(cars.get(12), "https://cdn.motor1.com/images/mgl/crv/s3/2022-honda-crv.jpg",                 true);
            addImage(cars.get(13), "https://cdn.motor1.com/images/mgl/city/s3/2023-honda-city.jpg",               true);
            addImage(cars.get(14), "https://cdn.motor1.com/images/mgl/city/s3/2023-honda-city.jpg",               true);
            addImage(cars.get(15), "https://cdn.motor1.com/images/mgl/hrv/s3/2023-honda-hrv.jpg",                 true);
            addImage(cars.get(16), "https://cdn.motor1.com/images/mgl/f150/s3/2023-ford-f150.jpg",                true);
            addImage(cars.get(16), "https://cdn.motor1.com/images/mgl/f150/s3/2023-ford-f150-bed.jpg",            false);
            addImage(cars.get(17), "https://cdn.motor1.com/images/mgl/ranger/s3/2023-ford-ranger.jpg",            true);
            addImage(cars.get(18), "https://cdn.motor1.com/images/mgl/ranger/s3/2023-ford-ranger.jpg",            true);
            addImage(cars.get(19), "https://cdn.motor1.com/images/mgl/modely/s3/2024-tesla-model-y.jpg",          true);
            addImage(cars.get(19), "https://cdn.motor1.com/images/mgl/modely/s3/2024-tesla-model-y-interior.jpg", false);
            addImage(cars.get(20), "https://cdn.motor1.com/images/mgl/modely/s3/2024-tesla-model-y.jpg",          true);
            addImage(cars.get(21), "https://cdn.motor1.com/images/mgl/model3/s3/2024-tesla-model-3.jpg",          true);
            addImage(cars.get(22), "https://cdn.motor1.com/images/mgl/tucson/s3/2023-hyundai-tucson.jpg",         true);
            addImage(cars.get(23), "https://cdn.motor1.com/images/mgl/ioniq5/s3/2024-hyundai-ioniq5.jpg",         true);
            addImage(cars.get(24), "https://cdn.motor1.com/images/mgl/seltos/s3/2023-kia-seltos.jpg",             true);
            addImage(cars.get(25), "https://cdn.motor1.com/images/mgl/mazda3/s3/2023-mazda3.jpg",                 true);
            addImage(cars.get(26), "https://cdn.motor1.com/images/mgl/cx5/s3/2023-mazda-cx5.jpg",                 true);
            addImage(cars.get(27), "https://cdn.motor1.com/images/mgl/cclass/s3/2023-mercedes-c-class.jpg",       true);
            addImage(cars.get(28), "https://cdn.motor1.com/images/mgl/3series/s3/2023-bmw-3series.jpg",           true);
            addImage(cars.get(29), "https://cdn.motor1.com/images/mgl/vf6/s3/2024-vinfast-vf6.jpg",               true);
            addImage(cars.get(30), "https://cdn.motor1.com/images/mgl/vf6/s3/2024-vinfast-vf6.jpg",               true);
            addImage(cars.get(31), "https://cdn.motor1.com/images/mgl/vf8/s3/2024-vinfast-vf8.jpg",               true);

            carRepository.saveAll(cars);
            log.info("✅ Seeded {} cars", cars.size());
        } catch (Exception e) {
            log.error("❌ Failed to seed cars: {}", e.getMessage());
        }
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
package com.swd.aiservice.service;

import com.swd.rentalcar.entity.Car;
import com.swd.rentalcar.entity.CarModel;
import com.swd.rentalcar.entity.enums.CarStatus;
import com.swd.aiservice.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CarVectorSyncService {

    private final CarRepository carRepository;
    private final VectorStore vectorStore;

    @Transactional(readOnly = true)
    public void syncCarsToVectorDb() {
        log.info("🚀 Bắt đầu kéo dữ liệu từ PostgreSQL và đồng bộ sang Qdrant...");

        List<Car> availableCars = carRepository.findByStatus(CarStatus.AVAILABLE);

        if (availableCars.isEmpty()) {
            log.warn("⚠️ Không có chiếc xe nào ở trạng thái AVAILABLE để đồng bộ.");
            return;
        }

        List<Document> documents = availableCars.stream().map(car -> {

            // 1. Khai thác triệt để dữ liệu từ các Entity liên kết
            CarModel model = car.getCarModel();

            String brandName = (model != null && model.getBrand() != null) ? model.getBrand().getName() : "Không rõ hãng";
            String typeName = (model != null && model.getType() != null) ? model.getType().getTypeName() : "Không rõ phân khúc";
            String modelName = (model != null) ? model.getName() : "Chưa cập nhật tên xe";
            String description = (model != null && model.getDescription() != null) ? model.getDescription() : "";
            int year = (model != null && model.getYear() != null) ? model.getYear() : 2020;
            int seats = (model != null && model.getSeats() != null) ? model.getSeats() : 5;

            // Chuyển đổi Enum sang tiếng Việt để AI dễ hiểu ngữ cảnh của người dùng Việt Nam
            String fuelType = "Không rõ";
            if (model != null && model.getFuelType() != null) {
                fuelType = switch (model.getFuelType()) {
                    case GASOLINE -> "Máy Xăng";
                    case DIESEL -> "Máy Dầu";
                    case ELECTRIC -> "Xe Điện";
                    case HYBRID -> "Xăng lai Điện (Hybrid)";
                    default -> model.getFuelType().name();
                };
            }

            String transmission = "Không rõ";
            if (model != null && model.getTransmission() != null) {
                transmission = switch (model.getTransmission()) {
                    case AUTOMATIC -> "Số Tự Động";
                    case MANUAL -> "Số Sàn";
                    default -> model.getTransmission().name();
                };
            }

            double price = car.getBasePricePerDay() != null ? car.getBasePricePerDay().doubleValue() : 0.0;
            double deposit = car.getDepositAmount() != null ? car.getDepositAmount().doubleValue() : 0.0;

            // 2. Xây dựng "Đoạn văn Thần thánh" (Siêu giàu từ khóa cho Semantic Search)
            String content = String.format(
                    "Thông tin chi tiết xe: %s %s đời %d. " +
                            "Đây là dòng xe %s, thiết kế %d chỗ ngồi. " +
                            "Động cơ: %s. Hộp số: %s. " +
                            "Đặc điểm nổi bật: %s. " +
                            "Biển số kiểm soát: %s. " +
                            "Mức giá thuê cơ bản: %,.0f VNĐ/ngày. Yêu cầu đặt cọc: %,.0f VNĐ.",
                    brandName, modelName, year,
                    typeName, seats,
                    fuelType, transmission,
                    description,
                    car.getLicensePlate(),
                    price, deposit
            );

            // 3. Metadata (Giữ lại các thông số dạng số/chuỗi chuẩn để Frontend dễ xài hoặc để Filter)
            Map<String, Object> metadata = Map.of(
                    "carId", car.getId(),
                    "brand", brandName,
                    "model", modelName,
                    "type", typeName,
                    "seats", seats,
                    "price", price,
                    "status", car.getStatus().name()
            );

            // 4. Tạo Document với UUID cố định
            String documentId = java.util.UUID.nameUUIDFromBytes(("car-" + car.getId()).getBytes()).toString();

            return new Document(documentId, content, metadata);

        }).collect(Collectors.toList());

        vectorStore.add(documents);
        log.info("✅ Đã nhúng (embed) và đồng bộ thành công {} xe vào Qdrant Vector DB!", documents.size());
    }
}
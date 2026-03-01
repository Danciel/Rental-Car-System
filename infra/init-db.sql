-- Tạo các database cho từng Microservice
CREATE DATABASE user_db;
CREATE DATABASE car_db;
CREATE DATABASE booking_db;
CREATE DATABASE payment_db;

-- Chú ý: Docker image postgres mặc định sẽ chạy script này
-- bằng user root (postgres) được định nghĩa trong docker-compose
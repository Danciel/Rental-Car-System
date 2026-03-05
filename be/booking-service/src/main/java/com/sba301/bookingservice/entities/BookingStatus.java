package com.sba301.bookingservice.entities;

public enum BookingStatus {
  PENDING_APPROVAL, // Bước 1: Khách vừa gửi yêu cầu, chờ Chủ xe duyệt
  PENDING_PAYMENT,  // Bước 2: Chủ xe đã duyệt, chờ Khách thanh toán
  CONFIRMED,        // Bước 3: Khách đã thanh toán, chờ đến ngày nhận xe nhận xe
  IN_PROGRESS,      // Bước 4: Khách đang giữ xe (Khởi hành)
  COMPLETED,        // Bước 5: Đã trả xe xong
  REJECTED,         // Chủ xe từ chối cho thuê
  CANCELLED         // Khách hoặc Chủ xe hủy ngang
  // (Chỉ có thể hủy khi đang ở B1, B2, B3; hủy ở B3 sẽ bị phạt một phần tiền cọc dựa theo số ngày còn lại so với ngày nhận xe)
}
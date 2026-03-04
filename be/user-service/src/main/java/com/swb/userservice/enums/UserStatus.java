package com.swb.userservice.enums;

public enum UserStatus {
    ACTIVE,

    // Người dùng đã đăng ký nhưng chưa xác nhận email hoặc hoàn tất quá trình đăng ký. Sau 1 thời gian nhất định, nếu người dùng vẫn chưa hoàn tất quá trình xác nhận hoặc không login, tài khoản tự động chuyển sang trạng thái INACTIVE giúp tiết kiệm tài nguyên.
    INACTIVE,

    // Người dùng bị cấm truy cập do vi phạm chính sách hoặc quy định của hệ thống
    BANNED,

    // Người dùng đã yêu cầu xóa tài khoản và đang chờ xử lý. Trong trạng thái này, tài khoản vẫn tồn tại nhưng không thể sử dụng được cho đến khi quá trình xóa hoàn tất. Có thể hủy yêu cầu xóa nếu người dùng thay đổi ý định.
    PENDING_DELETION
}
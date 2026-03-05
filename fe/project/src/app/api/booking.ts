const API_URL = "http://localhost:8080/api/bookings";

// Hàm helper để tự động lấy token
const getHeaders = () => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const bookingAPI = {
    // 1. Khách hàng gửi yêu cầu thuê xe (Bước 1)
    requestBooking: async (bookingData: { carId: number, startTime: string, endTime: string, rentalPrice: number, depositAmount: number }) => {
        const response = await fetch(`${API_URL}/request`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(bookingData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Không thể gửi yêu cầu đặt xe");
        return data;
    },

    // 2. Chủ xe phản hồi (Duyệt / Từ chối) (Bước 2)
    respondToRequest: async (bookingId: number, accept: boolean) => {
        const response = await fetch(`${API_URL}/${bookingId}/respond?accept=${accept}`, {
            method: 'PATCH',
            headers: getHeaders()
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Lỗi khi phản hồi yêu cầu");
        return data;
    },

    // 3. Khách hàng thanh toán giả lập (Bước 3)
    mockPayment: async (bookingId: number) => {
        const response = await fetch(`${API_URL}/${bookingId}/mock-pay`, {
            method: 'POST',
            headers: getHeaders()
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Thanh toán thất bại");
        return data;
    }
};
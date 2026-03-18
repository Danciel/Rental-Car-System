const API_URL = "http://localhost:8080/api/bookings";

// Hàm helper để tự động lấy token
const getHeaders = () => {
    const token = localStorage.getItem('ACCESS_TOKEN');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;

        try {
          // 1. Tách lấy phần payload của JWT
          const base64Url = token.split('.')[1];

          // 2. Giải mã Base64 (Xử lý cả ký tự đặc biệt của JWT)
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            window.atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );

          // 3. Parse JSON và lấy roles
          const payload = JSON.parse(jsonPayload);
          if (payload.roles) {
            headers['X-User-Roles'] = payload.roles;
          }
          if (payload.sub) {
            headers['X-User-Email'] = payload.sub;
          }
        } catch (error) {
          console.error("Không thể giải mã token:", error);
        }
      }
    return headers;
};


export const bookingAPI = {
    getManage: async (email: string) => {
            const response = await fetch(`${API_URL}/manage`, {
                headers: getHeaders()
            });
            const text = await response.text();
            const data = text ? JSON.parse(text) : {};
            if (!response.ok) throw new Error(data.message || "Không thể lấy danh sách booking");
            return data.data ?? [];
        },
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
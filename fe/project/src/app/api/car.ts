// src/app/api/car.ts
const API_URL = 'http://localhost:8080/api/cars';

const getHeaders = (email?: string) => {
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
    } catch (error) {
      console.error("Không thể giải mã token:", error);
    }
  }

  if (email) headers['X-User-Email'] = email;
  return headers;
};

export const carAdminApi = {
  getPendingReview: async () => {
    const res = await fetch(`${API_URL}/pending-review`, { headers: getHeaders() });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(data.message || 'Không thể lấy danh sách xe chờ duyệt');
    return data.data ?? [];
  },

  reviewCar: async (id: number, decision: 'APPROVED' | 'REJECTED', email: string) => {
    const res = await fetch(`${API_URL}/${id}/review?decision=${decision}`, {
      method: 'PATCH',
      headers: getHeaders(email)
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(data.message || 'Có lỗi xảy ra');
    return data;
  }
};

export const carOwnerApi = {
  registerCar: async (request: {
    licensePlate: string;
    basePricePerDay: number;
    depositAmount: number;
    carModelId: number;
    images: { imageUrl: string; isThumbnail: boolean }[];
  }, email: string) => {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: getHeaders(email),
      body: JSON.stringify(request)
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(data.message || 'Không thể đăng ký xe');
    return data;
  }
};
const API_URL = "http://localhost:8080/api/users";

export const authAPI = {
    // 1. Hàm Đăng Nhập
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            // Xử lý lỗi từ Backend (VD: Sai mật khẩu)
            if (!response.ok) throw new Error(data.message || "Đăng nhập thất bại");

            return data;
        } catch (error) {
            throw error;
        }
    },

    // 2. Hàm Đăng Ký
    register: async (userData) => {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Đăng ký thất bại");

            return data;
        } catch (error) {
            throw error;
        }
    }
};
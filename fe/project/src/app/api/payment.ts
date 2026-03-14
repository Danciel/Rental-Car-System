const API_URL = "http://localhost:8080/api/payments";

export const paymentAPI = {
    // API dành cho User thông thường
    getTransactions: async (userId, params = {}) => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (!token) throw new Error("No token found");

        // Chuyển đổi object params thành query string (page, size, type, status...)
        const queryString = new URLSearchParams(
            Object.fromEntries(
                Object.entries(params).filter(([_, v]) => v !== undefined && v !== "")
            )
        ).toString();

        const response = await fetch(`${API_URL}/history/${userId}?${queryString}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to fetch transactions");
        }

        return await response.json();
    },

    // API dành cho Admin lấy toàn bộ lịch sử
    getAllTransactions: async (params = {}) => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (!token) throw new Error("No token found");

        const queryString = new URLSearchParams(
            Object.fromEntries(
                Object.entries(params).filter(([_, v]) => v !== undefined && v !== "all" && v !== "")
            )
        ).toString();

        const response = await fetch(`${API_URL}/history/all?${queryString}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to fetch transactions");
        }

        return await response.json();
    }
};
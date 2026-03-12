const API_URL = "http://localhost:8080/api/users";

export const userAPI = {
    getMyProfile: async () => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (!token) throw new Error("No token found");

        const response = await fetch(`${API_URL}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("ACCESS_TOKEN");
                localStorage.removeItem("USER_EMAIL");
            }
            throw new Error("Failed to fetch profile");
        }

        return await response.json();
    },

    updateMyProfile: async (data: { fullName: string; phone: string; dateOfBirth: string }) => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (!token) throw new Error("No token found");

        const response = await fetch(`${API_URL}/me`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Update failed");
        }

        return await response.json();
    },

    resendVerification: async () => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (!token) throw new Error("No token found");

        const response = await fetch(`${API_URL}/me/resend-verification`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to resend email");
        }

        return await response.json();
    }
};
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
    }
};
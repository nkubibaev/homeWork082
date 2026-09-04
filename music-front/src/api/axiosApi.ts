import axios from 'axios';

interface StoredUser {
    token: string | null;
}

const axiosApi = axios.create({
    baseURL: 'http://localhost:8000',
});

axiosApi.interceptors.request.use((config) => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
        return config;
    }

    try {
        const user = JSON.parse(storedUser) as StoredUser;

        if (user.token) {
            config.headers.Authorization = user.token;
        }
    } catch {
        localStorage.removeItem('user');
    }

    return config;
});

export default axiosApi;
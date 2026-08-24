import axios from 'axios';

const axiosApi = axios.create({
    baseURL: 'http://localhost:8000',
});

axiosApi.interceptors.request.use((config) => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
        const user = JSON.parse(storedUser);

        if (user.token) {
            config.headers.Authorization = user.token;
        }
    }

    return config;
});

export default axiosApi;
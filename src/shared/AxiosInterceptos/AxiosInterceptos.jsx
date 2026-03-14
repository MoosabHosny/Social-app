import axios from "axios";

// 1. Create Instance
export const axiosInstance = axios.create({
    baseURL: 'https://route-posts.routemisr.com',
});

// 2. Request Interceptor (Before sending the request)
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // إضافة التوكن للهيدرز بشكل تلقائي
            config.headers.token = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Response Interceptor (After receiving the response)
axiosInstance.interceptors.response.use(
    (response) => {
        
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.error("Session expired. Please login again.");
        }
        return Promise.reject(error);
    }
);
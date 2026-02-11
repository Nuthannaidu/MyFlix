import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// 🔥 GLOBAL ERROR HANDLER
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    window.location.href = "/error";

    return Promise.reject(error);
  }
);

export const getVideos = () => api.get('/videos');
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

export default api;

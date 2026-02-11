import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 🚀 Required to send/receive cookies
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. If it's a 401, don't redirect to /error. 
    // Let the component or Redux handle the redirect to /login.
    if (error.response?.status === 401) {
      console.warn("Unauthorized request - session likely expired.");
      return Promise.reject(error);
    }

    // 2. Only redirect to /error for server crashes (500s)
    if (!error.response || error.response.status >= 500) {
      window.location.href = "/error";
    }

    return Promise.reject(error);
  }
);

export default api;
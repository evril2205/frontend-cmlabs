import axios from 'axios';

// Base URL backend - SESUAIKAN dengan port backend kamu
const API_BASE_URL = 'http://localhost:5000/api';

// Buat axios instance dengan default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk auto attach token dari localStorage
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage (sesuai dengan login yang udah ada)
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handle error response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized (token expired/invalid)
    if (error.response?.status === 401) {
      // Optional: redirect ke login
      // window.location.href = '/login';
      console.error('Unauthorized - Token invalid or expired');
    }
    
    return Promise.reject(error);
  }
);

export default api;
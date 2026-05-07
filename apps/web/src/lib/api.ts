import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — har bir so'rovga token qo'shadi
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor — 401 bo'lsa login ga yo'naltiradi
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url ?? '';
      const isAuthCall = url.includes('/auth/login') || url.includes('/auth/register');
      if (typeof window !== 'undefined' && !isAuthCall) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data || error);
  },
);

export default api;
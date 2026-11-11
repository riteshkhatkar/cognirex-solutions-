import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/cms';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cognirex_cms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthCheck = error.config?.url?.includes('/auth/me');
      const isLogin = error.config?.url?.includes('/auth/login');
      if (!isAuthCheck && !isLogin) {
        localStorage.removeItem('cognirex_cms_token');
        if (!window.location.pathname.endsWith('/login')) {
          window.location.href = '/cms/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const WEBSITE_ORIGIN = import.meta.env.VITE_WEBSITE_URL || '';

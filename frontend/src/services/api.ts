import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_API_URL;

const api = axios.create({
  baseURL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hero_token');
    if(token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if(error.response && error.response.status === 401) {
      localStorage.removeItem('hero_token');
      localStorage.removeItem('hero_user');
      if(window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
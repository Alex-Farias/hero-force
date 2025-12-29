import axios from 'axios';
import { MockFactory } from '../mocks/factory';

const baseURL = import.meta.env.VITE_BACKEND_API_URL;

const api = axios.create({
  baseURL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV && localStorage.getItem('hero_use_mocks') === 'true') {
      config.adapter = async (cfg) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            let data: any = [];
            const url = cfg.url || '';
            
            if (url.includes('/users') && cfg.method === 'get') {
              data = MockFactory.generateUsers(12);
            } else if (url.includes('/projects') && cfg.method === 'get') {
              data = MockFactory.generateProjects(24);
            }
            
            resolve({
              data,
              status: 200,
              statusText: 'OK',
              headers: {},
              config: cfg,
              request: {}
            });
          }, 600);
        });
      };
    }

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
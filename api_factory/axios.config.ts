import axios from 'axios';

const getBaseUrl = () => {
  return 'http://localhost:3005/api/v1';
};

export const GATEWAY_ENDPOINT = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  timeout: 15000,
});

export const GATEWAY_ENDPOINT_WITH_AUTH = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  timeout: 15000,
});

const getToken = () => {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('admin_token');
};

// Add request interceptor to inject token
GATEWAY_ENDPOINT_WITH_AUTH.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401
GATEWAY_ENDPOINT_WITH_AUTH.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

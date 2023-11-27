import axios from 'axios';

const getToken = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const { token } = JSON.parse(user);
    return token;
  }
  return null;
};

const api = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

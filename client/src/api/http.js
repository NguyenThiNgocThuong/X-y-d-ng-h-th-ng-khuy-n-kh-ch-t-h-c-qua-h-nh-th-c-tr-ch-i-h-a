import axios from 'axios';

// Axios dùng chung. Vite proxy chuyển /api sang http://localhost:5000
const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Từ Đợt 2: gắn JWT vào mỗi request
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default http;

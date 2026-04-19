import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5002/api/v1' });
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('ae_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

export const getAttendance = (params) => API.get('/attendance', { params });
export const createAttendance = (data) => API.post('/attendance', data);
export const updateAttendance = (id, data) => API.put(`/attendance/${id}`, data);
export const deleteAttendance = (id) => API.delete(`/attendance/${id}`);
export const rateAttendance = (id, rating) => API.put(`/attendance/${id}/rate`, { rating });
export const toggleFavorite = (id) => API.put(`/attendance/${id}/favorite`);

export default API;

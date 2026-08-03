import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

// Auth
export const register = (data) =>
  api.post('/auth/register', data).then((res) => res.data);

export const login = (data) =>
  api.post('/auth/login', data).then((res) => res.data);

export const getProfile = () =>
  api.get('/profile').then((res) => res.data);

export const updateProfile = (data) =>
  api.put('/profile', data).then((res) => res.data);

// Meetings
export const getMeetings = (params = {}) =>
  api.get('/meetings', { params }).then((res) => res.data);

export const getMeetingById = (id) =>
  api.get(`/meetings/${id}`).then((res) => res.data);

export const createMeeting = (data) =>
  api.post('/meetings', data).then((res) => res.data);

export const updateMeeting = (id, data) =>
  api.put(`/meetings/${id}`, data).then((res) => res.data);

export const deleteMeeting = (id) =>
  api.delete(`/meetings/${id}`).then((res) => res.data);

// Action items
export const getActionItems = (params = {}) =>
  api.get('/actions', { params }).then((res) => res.data);

export const createActionItem = (data) =>
  api.post('/actions', data).then((res) => res.data);

export const updateActionItem = (id, data) =>
  api.put(`/actions/${id}`, data).then((res) => res.data);

export const deleteActionItem = (id) =>
  api.delete(`/actions/${id}`).then((res) => res.data);

export const getDashboardStats = () =>
  api.get('/actions/stats').then((res) => res.data);

export default api;

import api from './axiosConfig';
import { API_BASE_URL } from './config';

const API_AUTH = `${API_BASE_URL}/auth`;

export const login = async (credentials) => {
  const response = await api.post(`/auth/signin`, credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const register = async (userData) => {
  return await api.post(`/auth/signup`, userData);
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const verifyToken = async (token) => {
  try {
    const response = await api.get('/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.message === 'Token is valid';
  } catch (error) {
    return false;
  }
};

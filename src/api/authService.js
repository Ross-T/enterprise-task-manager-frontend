import api from './axiosConfig';

/**
 * Authenticates a user with the provided credentials
 * @param {Object} credentials - User login credentials (email, password)
 * @returns {Promise<Object>} User data including JWT token
 */
export const login = async (credentials) => {
  const response = await api.post(`/auth/signin`, credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

/**
 * Registers a new user
 * @param {Object} userData - User registration data (username, email, password)
 * @returns {Promise<Object>} Registration response
 */
export const register = async (userData) => {
  return await api.post(`/auth/signup`, userData);
};

/**
 * Logs out the current user by removing authentication data
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Retrieves the currently logged in user from localStorage
 * @returns {Object|null} User data or null if no user is logged in
 */
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

/**
 * Verifies if the provided JWT token is valid
 * @param {string} token - JWT token to verify
 * @returns {Promise<boolean>} True if token is valid, false otherwise
 */
export const verifyToken = async (token) => {
  try {
    const response = await api.get('/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.message === 'Token is valid';
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
};

import axios from 'axios';
import { login, register, logout, getCurrentUser } from './authService';
import { API_BASE_URL } from './config';

jest.mock('axios');

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key]),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Auth Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  describe('login', () => {
    const credentials = { email: 'test@example.com', password: 'password123' };
    const mockResponse = {
      data: {
        token: 'fake-jwt-token',
        username: 'testuser',
        email: 'test@example.com'
      }
    };

    it('should make a POST request to /auth/signin', async () => {
      axios.post.mockResolvedValueOnce(mockResponse);
      
      await login(credentials);
      
      expect(axios.post).toHaveBeenCalledWith(
        `${API_BASE_URL}/auth/signin`,
        credentials
      );
    });

    it('should store the token in localStorage on successful login', async () => {
      axios.post.mockResolvedValueOnce(mockResponse);
      
      await login(credentials);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'token',
        mockResponse.data.token
      );
    });

    it('should return user data on successful login', async () => {
      axios.post.mockResolvedValueOnce(mockResponse);
      
      const result = await login(credentials);
      
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when login fails', async () => {
      const errorMessage = 'Invalid credentials';
      axios.post.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(login(credentials)).rejects.toThrow(errorMessage);
    });
  });

  describe('register', () => {
    const userData = { 
      username: 'newuser', 
      email: 'newuser@example.com', 
      password: 'password123' 
    };
    const mockResponse = {
      data: {
        message: 'User registered successfully!'
      }
    };

    it('should make a POST request to /auth/signup', async () => {
      axios.post.mockResolvedValueOnce(mockResponse);
      
      await register(userData);
      
      expect(axios.post).toHaveBeenCalledWith(
        `${API_BASE_URL}/auth/signup`,
        userData
      );
    });

    it('should return response data on successful registration', async () => {
      axios.post.mockResolvedValueOnce(mockResponse);
      
      const result = await register(userData);
      
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when registration fails', async () => {
      const errorMessage = 'Email already in use';
      axios.post.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(register(userData)).rejects.toThrow(errorMessage);
    });
  });

  describe('logout', () => {
    it('should remove token from localStorage', () => {
      localStorageMock.setItem('token', 'fake-jwt-token');
      
      logout();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    });
  });

  describe('getCurrentUser', () => {
    it('should retrieve user from localStorage', () => {
      const mockUser = { username: 'testuser', email: 'test@example.com' };
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockUser));
      
      const result = getCurrentUser();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('user');
      expect(result).toEqual(mockUser);
    });

    it('should return null if no user in localStorage', () => {
      localStorageMock.getItem.mockReturnValueOnce(null);
      
      const result = getCurrentUser();
      
      expect(result).toBeNull();
    });
  });
});

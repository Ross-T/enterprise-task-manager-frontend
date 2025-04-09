import React, { createContext, useContext, useReducer, useEffect } from "react";
import * as authService from "../api/authService";

// Create context
export const AuthContext = createContext();

// Initial state
const initialState = {
  isAuthenticated: Boolean(localStorage.getItem("token")),
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    case "REGISTER_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Actions
  const login = async (credentials) => {
    dispatch({ type: "AUTH_REQUEST" });
    try {
      const response = await authService.login(credentials);
      const userData = {
        username: response.username,
        email: response.email,
        roles: response.roles,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      dispatch({ type: "LOGIN_SUCCESS", payload: userData });
      return response;
    } catch (error) {
      dispatch({
        type: "AUTH_ERROR",
        payload: error.response?.data?.message || "Login failed",
      });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: "AUTH_REQUEST" });
    try {
      const response = await authService.register(userData);
      dispatch({ type: "REGISTER_SUCCESS", payload: response.data });

      return response.data;
    } catch (error) {
      dispatch({
        type: "AUTH_ERROR",
        payload: error.response?.data?.message || "Registration failed",
      });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  // Check token validity on app start
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        logout();
        return;
      }

      // verify token on backend
      try {
        const isValid = await authService.verifyToken(token);
        if (isValid) {
          const user = JSON.parse(localStorage.getItem("user"));
          if (user) {
            dispatch({ type: "LOGIN_SUCCESS", payload: user });
          } else {
            logout();
          }
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    };

    verifyToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// API URL
const API_URL = import.meta.env.VITE_API_URL || 'https://pixelmoonstore.in/api/v1';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Setup axios default headers when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      getCurrentUser();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Get current user data
  const getCurrentUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/auth/me`);
      setUser(response.data.user);
      setError(null);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.response?.data?.msg || 'An error occurred');
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      setToken(response.data.token);
      setUser(response.data.user);
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.msg || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      setToken(response.data.token);
      setUser(response.data.user);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.msg || 'Invalid credentials');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
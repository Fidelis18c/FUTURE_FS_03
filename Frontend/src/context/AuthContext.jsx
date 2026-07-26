import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('hs_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('hs_token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Attach token to every API request
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('hs_token', data.token);
      localStorage.setItem('hs_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please try again.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (full_name, email, phone_number, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/register', { full_name, email, phone_number, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('hs_token', data.token);
      localStorage.setItem('hs_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hs_token');
    localStorage.removeItem('hs_user');
    delete api.defaults.headers.common['Authorization'];
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, setError, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

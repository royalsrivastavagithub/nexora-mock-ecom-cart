import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useApi } from './ApiContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const api = useApi();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user data', error);
        // If token is invalid, clear it
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } else {
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, [token, api]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    await fetchUser(); // Fetch user details immediately after login
  };

  const register = async (username, email, password, address) => {
    const { data } = await api.post('/auth/register', { username, email, password, address });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    await fetchUser(); // Fetch user details immediately after registration
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const updateUser = async (userData) => {
    try {
      const { data } = await api.put('/auth/me', userData);
      setUser(data);
      return data;
    } catch (error) {
      console.error('Failed to update user', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

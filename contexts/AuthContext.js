import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authService from '../services/authService';
import * as storageService from '../services/storageService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      // Effacer d'abord le token pour les tests
      await storageService.removeToken();
      
      const storedToken = await storageService.getToken();
      if (storedToken) {
        try {
          // Vérifier si le token est valide avec le backend
          const response = await authService.verifyToken(storedToken);
          if (response.valid) {
            setToken(storedToken);
          } else {
            await storageService.removeToken();
            setToken(null);
          }
        } catch (error) {
          await storageService.removeToken();
          setToken(null);
        }
      }
    } catch (error) {
      console.error('Error loading token:', error);
      await storageService.removeToken();
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.token) {
        await storageService.storeToken(response.token);
        setToken(response.token);
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password, username) => {
    try {
      const response = await authService.register(email, password, username);
      if (response.token) {
        await storageService.storeToken(response.token);
        setToken(response.token);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await storageService.removeToken();
      setToken(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
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

  const handleToken = async (token) => {
    if (token) {
      await storageService.storeToken(token);
      setToken(token);
    } else {
      await storageService.removeToken();
      setToken(null);
    }
  };
  

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      await handleToken(response.token);
    } catch (error) {
      throw error;
    }
  };
  

  const register = async (email, password, name) => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Merci de remplir tous les champs.');
      return;
    }
    try {
      const response = await authService.register(email, password, name);
      await handleToken(response.token);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const currentToken = await storageService.getToken();
      if (currentToken) {
        await storageService.removeToken();
        setToken(null);
      }
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
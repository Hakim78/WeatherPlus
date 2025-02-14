import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration de l'URL de base de ton API (modifie cette URL avec celle de ton backend)
const API_URL = 'http://IPV4_ICI:4000/user';  // Utilise ton propre serveur backend si nécessaire

// Fonction login
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const token = response.data.token;
    await AsyncStorage.setItem('token', token);
    return { token };
  } catch (error) {
    throw new Error(error.response ? error.response.data.error : 'Erreur de connexion');
  }
};


// Fonction register
const register = async (name, email, password) => {
  try {
    // Envoie de la requête POST pour l'inscription
    const response = await axios.post(`${API_URL}/register`, { name, email, password });
    
    const token = response.data.token;
    await AsyncStorage.setItem('token', token);
    
    // Retourner un objet avec le token
    return { token };
  } catch (error) {
    throw new Error(error.response ? error.response.data.error : 'Erreur d\'inscription');
  }
};

const myUser = async (token) => {
  try {
    // Envoie de la requête GET pour récupérer l'utilisateur connecté
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Retourner l'utilisateur récupéré dans la réponse
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.error : 'Erreur lors de la récupération de l\'utilisateur');
  }
};

const verifyToken = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return { valid: true, user: response.data };
  } catch (error) {
    return { valid: false };
  }
};

export { login, register, myUser, verifyToken };
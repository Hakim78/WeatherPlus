import axios from 'axios';

// Configuration de l'URL de base de ton API (modifie cette URL avec celle de ton backend)
const API_URL = 'http://192.168.1.20:4000/user';  // Utilise ton propre serveur backend si nécessaire
// const API_URL = 'http://172.20.10.7:4000/user';  // IP Hackim

// Fonction login
const login = async (email, password) => {
  try {
    // Envoie de la requête POST pour la connexion
    const response = await axios.post(`${API_URL}/login`, { email, password });
    
    // Retourner le token récupéré dans la réponse
    return response.data.token;
  } catch (error) {
    throw new Error(error.response ? error.response.data.error : 'Erreur de connexion');
  }
};

// Fonction register
const register = async (name, email, password) => {
  try {
    // Envoie de la requête POST pour l'inscription
    const response = await axios.post(`${API_URL}/register`, { name, email, password });
    
    // Retourner le token récupéré dans la réponse
    return response.data.token;
  } catch (error) {
    throw new Error(error.response ? error.response.data.error : 'Erreur d\'inscription');
  }
};

const myUser = async () => {
  try {
    // Envoie de la requête GET pour récupérer l'utilisateur connecté
    const response = await axios.get(`${API_URL}/me`);
    
    // Retourner l'utilisateur récupéré dans la réponse
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.error : 'Erreur lors de la récupération de l\'utilisateur');
  }
};

export { login, register, myUser };
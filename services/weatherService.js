// Anas ou Sarah il faudra configuer l'api key ect...
const API_KEY = '55ec4b68d7f64b81bf3134710251102';
const BASE_URL = 'http://api.weatherapi.com/v1/current.json?key=';

const weatherService = {
  // Obtenir la météo par coordonnées
  getWeatherByCoords: async (lat, lon) => {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${API_KEY}`
      );
      const data = await response.json();
      if (response.ok) {
        return data;
      }
      throw new Error(data.message);
    } catch (error) {
      throw error;
    }
  },

  // Obtenir la météo par nom de ville
  getWeatherByCity: async (city) => {    
    try {
      const response = await fetch(
        `${BASE_URL}${API_KEY}&q=${city}&aqi=yes`
      );
      const data = await response.json();
      if (response.ok) {
        return data;
      }
      throw new Error(data.error ? data.error.message : "Erreur inconnue");
    } catch (error) {
      throw error;
    }
  },

  // Obtenir les prévisions sur 5 jours
  getForecast: async (lat, lon) => {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${API_KEY}`
      );
      const data = await response.json();
      if (response.ok) {
        return data;
      }
      throw new Error(data.message);
    } catch (error) {
      throw error;
    }
  }
};

export default weatherService;
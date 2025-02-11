const API_KEY = '55ec4b68d7f64b81bf3134710251102';
const BASE_URL = 'http://api.weatherapi.com/v1';

const weatherService = {
  // Obtenir la météo par coordonnées
  getWeatherByCoords: async (lat, lon) => {
    try {
      const response = await fetch(
        `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=yes`
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
        `${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=yes`
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
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=5&aqi=no&lang=fr`
      );
      const data = await response.json();
      
      console.log('Forecast API Response:', data); // Pour debug
      
      if (!response.ok) {
        throw new Error(data.error ? data.error.message : "Erreur inconnue");
      }
      return data;
    } catch (error) {
      console.error('Forecast Error:', error);
      throw error;
    }
  }
};

export default weatherService;
// Anas ou Sarah il faudra configuer l'api key ect...
const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

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
        `${BASE_URL}/weather?q=${city}&units=metric&lang=fr&appid=${API_KEY}`
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
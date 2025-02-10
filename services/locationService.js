import * as Location from 'expo-location';

const locationService = {
  // Demander la permission et obtenir la localisation actuelle
  getCurrentLocation: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error('Permission de localisation refusée');
      }

      const location = await Location.getCurrentPositionAsync({});
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
    } catch (error) {
      throw error;
    }
  },

  // Obtenir l'adresse à partir des coordonnées (géocodage inverse)
  getAddressFromCoords: async (latitude, longitude) => {
    try {
      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
      return address;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir les coordonnées à partir d'une adresse (géocodage)
  getCoordsFromAddress: async (address) => {
    try {
      const locations = await Location.geocodeAsync(address);
      if (locations.length > 0) {
        return {
          latitude: locations[0].latitude,
          longitude: locations[0].longitude
        };
      }
      throw new Error('Adresse non trouvée');
    } catch (error) {
      throw error;
    }
  }
};

export default locationService;
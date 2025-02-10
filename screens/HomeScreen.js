import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import locationService from '../services/locationService';
import weatherService from '../services/weatherService';

export default function HomeScreen() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      // Obtenir la localisation
      const location = await locationService.getCurrentLocation();
      
      // Obtenir la météo pour cette localisation
      const weather = await weatherService.getWeatherByCoords(
        location.latitude,
        location.longitude
      );
      
      setWeatherData(weather);
    } catch (err) {
      setError('Impossible de récupérer la météo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {weatherData && (
        <View style={styles.weatherContainer}>
          <Text style={styles.locationText}>{weatherData.name}</Text>
          <View style={styles.mainWeather}>
            <Text style={styles.temperature}>
              {Math.round(weatherData.main.temp)}°C
            </Text>
            <Text style={styles.description}>
              {weatherData.weather[0].description}
            </Text>
          </View>
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Ionicons name="water-outline" size={24} color="#666" />
              <Text>{weatherData.main.humidity}%</Text>
              <Text style={styles.detailLabel}>Humidité</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="speedometer-outline" size={24} color="#666" />
              <Text>{weatherData.wind.speed} m/s</Text>
              <Text style={styles.detailLabel}>Vent</Text>
            </View>
          </View>
        </View>
      )}
      <View style={styles.logoutContainer}>
        <Text style={styles.logoutButton} onPress={logout}>
          Se déconnecter
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  locationText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  mainWeather: {
    alignItems: 'center',
    marginBottom: 30,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#f4511e',
  },
  description: {
    fontSize: 20,
    color: '#666',
    textTransform: 'capitalize',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  detailItem: {
    alignItems: 'center',
    padding: 10,
  },
  detailLabel: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  logoutContainer: {
    padding: 20,
  },
  logoutButton: {
    color: '#f4511e',
    textAlign: 'center',
    fontSize: 16,
  },
});
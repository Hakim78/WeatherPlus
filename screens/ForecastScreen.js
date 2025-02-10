import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import weatherService from '../services/weatherService';
import locationService from '../services/locationService';

export default function ForecastScreen() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForecast();
  }, []);

  const fetchForecast = async () => {
    try {
      // Obtenir la localisation actuelle
      const location = await locationService.getCurrentLocation();
      
      // Obtenir les prévisions pour cette localisation
      const forecastData = await weatherService.getForecast(
        location.latitude,
        location.longitude
      );
      
      // Organiser les données par jour
      const dailyForecast = groupForecastByDay(forecastData.list);
      setForecast(dailyForecast);
    } catch (err) {
      setError('Impossible de récupérer les prévisions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const groupForecastByDay = (list) => {
    const grouped = {};
    list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString();
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(item);
    });
    return grouped;
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Clear': return 'sunny';
      case 'Clouds': return 'cloudy';
      case 'Rain': return 'rainy';
      case 'Snow': return 'snow';
      default: return 'partly-sunny';
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
    <ScrollView style={styles.container}>
      {forecast && Object.entries(forecast).map(([day, dayForecast], index) => (
        <View key={day} style={styles.dayContainer}>
          <Text style={styles.dayTitle}>
            {index === 0 ? "Aujourd'hui" : new Date(day).toLocaleDateString('fr-FR', { weekday: 'long' })}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dayForecast.map((item, idx) => (
              <View key={idx} style={styles.hourForecast}>
                <Text style={styles.hourText}>
                  {new Date(item.dt * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Ionicons 
                  name={getWeatherIcon(item.weather[0].main)} 
                  size={24} 
                  color="#f4511e" 
                />
                <Text style={styles.temperature}>{Math.round(item.main.temp)}°C</Text>
                <View style={styles.details}>
                  <Text style={styles.detailText}>{item.main.humidity}%</Text>
                  <Ionicons name="water-outline" size={12} color="#666" />
                </View>
                <View style={styles.details}>
                  <Text style={styles.detailText}>{item.wind.speed}m/s</Text>
                  <Ionicons name="speedometer-outline" size={12} color="#666" />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
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
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  dayContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  hourForecast: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 100,
  },
  hourText: {
    fontSize: 14,
    marginBottom: 5,
  },
  temperature: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  detailText: {
    fontSize: 12,
    marginRight: 3,
    color: '#666',
  },
});
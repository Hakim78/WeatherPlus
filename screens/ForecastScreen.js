import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
      const location = await locationService.getCurrentLocation();
      const forecastData = await weatherService.getForecast(
        location.latitude,
        location.longitude
      );
      
      // Vérification des données et meilleure gestion des erreurs
      if (forecastData && forecastData.forecast && Array.isArray(forecastData.forecast.forecastday)) {
        setForecast(forecastData.forecast.forecastday);
        setError(null);
      } else {
        console.log('Forecast Data Structure:', forecastData); // Pour debug
        throw new Error('Format de données invalide');
      }
    } catch (err) {
      setError('Impossible de récupérer les prévisions');
      console.error('Erreur détaillée:', err);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#f4511e', '#ff8c00']}
        style={styles.centerContainer}
      >
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={['#f4511e', '#ff8c00']}
        style={styles.centerContainer}
      >
        <Ionicons name="cloud-offline-outline" size={50} color="#fff" />
        <Text style={styles.errorText}>{error}</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#f4511e', '#ff8c00']}
      style={styles.gradientBackground}
    >
      <ScrollView style={styles.container}>
        {forecast && forecast.map((day, index) => (
          <View key={day.date} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayTitle}>
                {index === 0 
                  ? "Aujourd'hui" 
                  : new Date(day.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
              </Text>
            </View>

            <View style={styles.dailySummary}>
              <Ionicons
                name={day.day.condition.text.toLowerCase().includes('rain') ? 'rainy' : 'sunny'}
                size={40}
                color="#f4511e"
              />
              <View style={styles.tempRange}>
                <Text style={styles.maxTemp}>{Math.round(day.day.maxtemp_c)}°C</Text>
                <Text style={styles.minTemp}>{Math.round(day.day.mintemp_c)}°C</Text>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourScroll}>
              {day.hour.map((hour, idx) => (
                <View key={idx} style={styles.hourCard}>
                  <Text style={styles.hourText}>
                    {new Date(hour.time).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                  <Text style={styles.temperature}>{Math.round(hour.temp_c)}°C</Text>
                  
                  <View style={styles.details}>
                    <Ionicons name="water-outline" size={14} color="#666" />
                    <Text style={styles.detailText}>{hour.humidity}%</Text>
                  </View>

                  <View style={styles.details}>
                    <Ionicons name="speedometer-outline" size={14} color="#666" />
                    <Text style={styles.detailText}>{hour.wind_kph} km/h</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.additionalInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="water" size={16} color="#666" />
                <Text style={styles.infoText}>Précipitations: {day.day.daily_chance_of_rain}%</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="thermometer" size={16} color="#666" />
                <Text style={styles.infoText}>Ressenti max: {Math.round(day.day.maxtemp_c)}°C</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1
  },
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  dayCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3
  },
  dayHeader: {
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#f4511e',
    paddingLeft: 10,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: '#333'
  },
  dailySummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  tempRange: {
    alignItems: 'flex-end',
  },
  maxTemp: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f4511e',
  },
  minTemp: {
    fontSize: 18,
    color: '#666',
  },
  hourScroll: {
    marginBottom: 15,
  },
  hourCard: {
    width: 90,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 3,
    elevation: 2
  },
  hourText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  temperature: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f4511e',
    marginVertical: 5,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 3,
  },
  additionalInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
});
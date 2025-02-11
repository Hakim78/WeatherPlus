import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import weatherService from '../services/weatherService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await weatherService.getWeatherByCity(searchQuery);
      setWeatherData(data);
    } catch (err) {
      setError('Ville non trouvée');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      const favoritesArray = favorites ? JSON.parse(favorites) : [];
      
      // Vérifier si la ville est déjà dans les favoris
      if (!favoritesArray.some(fav => fav.id === weatherData.id)) {
        const newFavorite = {
          id: weatherData.id,
          name: weatherData.name,
          // city: weatherData.name,
        };
        
        const newFavorites = [...favoritesArray, newFavorite];
        await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
        alert('Ville ajoutée aux favoris');
      } else {
        alert('Cette ville est déjà dans vos favoris');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      alert('Erreur lors de l\'ajout aux favoris');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une ville..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#f4511e" />
        </View>
      )}

      {error && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

{weatherData && (
  <View style={styles.weatherContainer}>
    <View style={styles.weatherHeader}>
      <Text style={styles.cityName}>
        {weatherData.location.name}, {weatherData.location.country}
      </Text>
      <TouchableOpacity onPress={addToFavorites}>
        <Ionicons name="heart-outline" size={24} color="#f4511e" />
      </TouchableOpacity>
    </View>

    <Text style={styles.temperature}>
      {Math.round(weatherData.current.temp_c)}°C
    </Text>
    <Text style={styles.description}>
      {weatherData.current.condition.text}
    </Text>

    <View style={styles.details}>
      <View style={styles.detailItem}>
        <Ionicons name="water-outline" size={24} color="#666" />
        <Text>{weatherData.current.humidity}%</Text>
        <Text style={styles.detailLabel}>Humidité</Text>
      </View>
      <View style={styles.detailItem}>
        <Ionicons name="speedometer-outline" size={24} color="#666" />
        <Text>{weatherData.current.wind_kph} km/h</Text>
        <Text style={styles.detailLabel}>Vent</Text>
      </View>
    </View>
  </View>
)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    margin: 10,
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
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
  weatherContainer: {
    padding: 20,
    alignItems: 'center',
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#f4511e',
    marginBottom: 10,
  },
  description: {
    fontSize: 20,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 20,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
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
});
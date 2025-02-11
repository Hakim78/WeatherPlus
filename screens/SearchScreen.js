import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import weatherService from '../services/weatherService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import favoriteService from '../services/favoriteService';



export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log("Token récupéré:", token);

      const favorites = await favoriteService.listFavorites(token);
      setFavorites(favorites);
    } catch (error) {
      console.log(error);
    }
  };

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
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté pour ajouter aux favoris');
        return;
      }

      const favorite = {
        id_ville: weatherData.location.name,
        nom_ville: weatherData.location.name,
      };

      await favoriteService.addFavorite(favorite, token);
      if (favorite.id_ville) {
        alert('Ville ajoutée aux favoris');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      alert('Erreur lors de l\'ajout aux favoris');
    }
  };

  const deleteFromFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté pour supprimer des favoris');
        return;
      }

      const favorite = favorites.find((favorite) => favorite.id_ville === weatherData.location.name);
      await favoriteService.deleteFavorite(favorite.id_ville, token);
      alert('Ville supprimée des favoris');
    } catch (error) {
      console.error('Erreur lors de la suppression des favoris:', error);
      alert('Erreur lors de la suppression des favoris');
    }
  };

  return (
    <LinearGradient
      colors={['#f4511e', '#ff8c00']}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={24}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une ville..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        {!loading && error && (
          <View style={styles.loaderContainer}>
            <Ionicons name="cloud-offline-outline" size={50} color="#fff" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

{weatherData && (
  <View style={styles.weatherContainer}>
    <View style={styles.weatherHeader}>
      <Text style={styles.cityName}>
        {weatherData.location.name}, {weatherData.location.country}
      </Text>

      {/* Si la ville est dans les favoris, afficher le bouton de suppression */}
      {favorites.find((favorite) => favorite.id_ville === weatherData.location.name) && (
        <TouchableOpacity onPress={deleteFromFavorites}>
          <Ionicons name="heart" size={24} color="#f4511e"/>
        </TouchableOpacity>
      )}

      {/* Sinon, afficher le bouton d'ajout */}
      {!favorites.find((favorite) => favorite.id_ville === weatherData.location.name) && (
        <TouchableOpacity onPress={addToFavorites}>
          <Ionicons name="heart-outline" size={24} color="#f4511e" />
        </TouchableOpacity>
      )}
      {/* <TouchableOpacity onPress={addToFavorites}>
        <Ionicons name="heart-outline" size={24} color="#f4511e" />
      </TouchableOpacity> */}
    </View>

            <View style={styles.mainWeather}>
              <Ionicons 
                name="sunny" 
                size={80} 
                color="#f4511e" 
                style={styles.weatherIcon}
              />
              <Text style={styles.temperature}>
                {Math.round(weatherData.current.temp_c)}°C
              </Text>
              <Text style={styles.description}>
                {weatherData.current.condition.text}
              </Text>
            </View>

            <View style={styles.details}>
              <View style={styles.detailItem}>
                <Ionicons name="water-outline" size={24} color="#666" />
                <Text style={styles.detailValue}>{weatherData.current.humidity}%</Text>
                <Text style={styles.detailLabel}>Humidité</Text>
              </View>
              <View style={styles.detailSeparator} />
              <View style={styles.detailItem}>
                <Ionicons name="speedometer-outline" size={24} color="#666" />
                <Text style={styles.detailValue}>{weatherData.current.wind_kph} km/h</Text>
                <Text style={styles.detailLabel}>Vent</Text>
              </View>
            </View>

            <View style={styles.additionalInfo}>
              <View style={styles.infoItem}>
                <Ionicons name="thermometer-outline" size={20} color="#666" />
                <Text style={styles.infoText}>
                  Ressenti: {weatherData.current.feelslike_c}°C
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="eye-outline" size={20} color="#666" />
                <Text style={styles.infoText}>
                  Visibilité: {weatherData.current.vis_km} km
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1
  },
  container: {
    flex: 1,
    padding: 16
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  searchIcon: {
    marginRight: 10
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: '#333',
    fontSize: 16
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center'
  },
  resultCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  mainWeather: {
    alignItems: 'center',
    marginBottom: 20
  },
  weatherIcon: {
    marginBottom: 10
  },
  temperature: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#f4511e',
    marginBottom: 5
  },
  description: {
    fontSize: 22,
    color: '#666',
    textTransform: 'capitalize'
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    justifyContent: 'space-around'
  },
  detailItem: {
    alignItems: 'center',
    flex: 1
  },
  detailSeparator: {
    width: 1,
    height: '100%',
    backgroundColor: '#eee'
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 5
  },
  detailLabel: {
    color: '#666',
    fontSize: 14,
    marginTop: 4
  },
  additionalInfo: {
    marginTop: 20
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  infoText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 16
  }
});
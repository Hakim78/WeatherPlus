import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import favoriteService from '../services/favoriteService';
import weatherService from '../services/weatherService';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  
  const loadFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log("Token récupéré:", token);

      const favoritesFromBackend = await favoriteService.listFavorites(token);
      if (favoritesFromBackend) {
        setFavorites(favoritesFromBackend);
        
        await updateWeatherData(favoritesFromBackend);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      Alert.alert('Erreur', 'Impossible de charger les favoris');
    } finally {
      setLoading(false);
    }
  };

  const updateWeatherData = async (favoritesArray) => {
    const weatherUpdates = {};
    for (const city of favoritesArray) {
      try {
        // Utilisation du nom de ville stocké dans "nom_ville"
        const weather = await weatherService.getWeatherByCity(city.nom_ville);
        weatherUpdates[city.id_ville] = weather;
      } catch (error) {
        console.error(`Erreur pour ${city.nom_ville}:`, error);
      }
    }
    setWeatherData(weatherUpdates);
  };

  const removeFavorite = async (cityId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await favoriteService.deleteFavorite(cityId, token);
      const updatedFavorites = favorites.filter(city => city.id_ville !== cityId);
      setFavorites(updatedFavorites);
      
      // Supprimer les données météo associées
      const updatedWeatherData = { ...weatherData };
      delete updatedWeatherData[cityId];
      setWeatherData(updatedWeatherData);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      Alert.alert('Erreur', 'Impossible de supprimer la ville des favoris');
    }
  };

  const refreshWeather = async () => {
    loadFavorites();
    await updateWeatherData(favorites);
  };

  const renderWeatherCard = ({ item }) => {
    const weather = weatherData[item.id_ville];
    if (!weather) return null;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cityName}>
            {item.nom_ville}{weather.location && weather.location.country ? `, ${weather.location.country}` : ''}
          </Text>
          <TouchableOpacity 
            onPress={() => {
              Alert.alert(
                'Supprimer des favoris',
                `Voulez-vous supprimer ${item.nom_ville} des favoris ?`,
                [
                  { text: 'Annuler', style: 'cancel' },
                  { text: 'Supprimer', onPress: () => removeFavorite(item.id_ville), style: 'destructive' }
                ]
              );
            }}
          >
            <Ionicons name="heart" size={24} color="#f4511e" />
          </TouchableOpacity>
        </View>

        <View style={styles.weatherInfo}>
          <Text style={styles.temperature}>
            {Math.round(weather.current.temp_c)}°C
          </Text>
          <Text style={styles.description}>
            {weather.current.condition.text}
          </Text>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="water-outline" size={20} color="#666" />
            <Text style={styles.detailText}>{weather.current.humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="speedometer-outline" size={20} color="#666" />
            <Text style={styles.detailText}>{weather.current.wind_kph} km/h</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={50} color="gray" />
          <Text style={styles.emptyText}>Aucune ville favorite</Text>
          <Text style={styles.subText}>
            Ajoutez des villes à vos favoris depuis la recherche
          </Text>
        </View>
      ) : (
        <>
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={refreshWeather}
          >
            <Ionicons name="refresh" size={24} color="#f4511e" />
            <Text style={styles.refreshText}>Actualiser</Text>
          </TouchableOpacity>

          <FlatList
            data={favorites}
            renderItem={renderWeatherCard}
            keyExtractor={(item) => item.id_ville.toString()}
            contentContainerStyle={styles.list}
          />
        </>
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 5,
  },
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cityName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weatherInfo: {
    alignItems: 'center',
    marginBottom: 10,
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f4511e',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textTransform: 'capitalize',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 5,
    color: '#666',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  refreshText: {
    marginLeft: 5,
    color: '#f4511e',
    fontSize: 16,
  },
});

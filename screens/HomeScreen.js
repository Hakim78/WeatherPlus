import React, { useEffect, useState } from 'react';
import { 
 View,
 Text,
 StyleSheet,
 ActivityIndicator,
 RefreshControl,
 ScrollView,
 TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import locationService from '../services/locationService';
import weatherService from '../services/weatherService';

export default function HomeScreen() {
 const { logout } = useAuth();
 const [loading, setLoading] = useState(true);
 const [weatherData, setWeatherData] = useState(null);
 const [error, setError] = useState(null);
 const [refreshing, setRefreshing] = useState(false);

 const fetchWeatherData = async () => {
   try {
     const location = await locationService.getCurrentLocation();
     const weather = await weatherService.getWeatherByCoords(
       location.latitude,
       location.longitude
     );
     setWeatherData(weather);
     setError(null);
   } catch (err) {
     setError('Impossible de récupérer la météo');
     console.error(err);
   } finally {
     setLoading(false);
     setRefreshing(false);
   }
 };

 useEffect(() => {
   fetchWeatherData();
 }, []);

 const onRefresh = () => {
   setRefreshing(true);
   fetchWeatherData();
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
       <TouchableOpacity style={styles.retryButton} onPress={fetchWeatherData}>
         <Text style={styles.retryText}>Réessayer</Text>
       </TouchableOpacity>
     </LinearGradient>
   );
 }

 return (
   <LinearGradient
     colors={['#f4511e', '#ff8c00']}
     style={styles.gradientBackground}
   >
     <ScrollView
       style={styles.container}
       contentContainerStyle={styles.scrollContent}
       refreshControl={
         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
       }
     >
       {weatherData && (
         <View style={styles.weatherCard}>
           <View style={styles.header}>
             <Ionicons name="location" size={24} color="#f4511e" />
             <Text style={styles.locationText}>
               {weatherData.location.name}, {weatherData.location.country}
             </Text>
           </View>

           <View style={styles.mainWeather}>
             <Ionicons 
               name="sunny" 
               size={100} 
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
               <Text style={styles.detailValue}>
                 {weatherData.current.wind_kph} km/h
               </Text>
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

       <TouchableOpacity style={styles.logoutButton} onPress={logout}>
         <Ionicons name="log-out-outline" size={20} color="#fff" />
         <Text style={styles.logoutText}>Se déconnecter</Text>
       </TouchableOpacity>
     </ScrollView>
   </LinearGradient>
 );
}

const styles = StyleSheet.create({
 gradientBackground: {
   flex: 1,
 },
 centerContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
 },
 container: {
   flex: 1,
   backgroundColor: 'transparent',
 },
 scrollContent: {
   flexGrow: 1,
   padding: 20,
   alignItems: 'center',
 },
 weatherCard: {
   width: '100%',
   backgroundColor: 'rgba(255, 255, 255, 0.9)',
   borderRadius: 20,
   padding: 20,
   marginBottom: 20,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.15,
   shadowRadius: 6,
   elevation: 5,
 },
 header: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 20,
 },
 locationText: {
   fontSize: 24,
   fontWeight: 'bold',
   marginLeft: 10,
   color: '#333',
 },
 mainWeather: {
   alignItems: 'center',
   marginBottom: 30,
 },
 weatherIcon: {
   marginBottom: 10,
 },
 temperature: {
   fontSize: 60,
   fontWeight: 'bold',
   color: '#f4511e',
 },
 description: {
   fontSize: 22,
   color: '#666',
   textTransform: 'capitalize',
 },
 details: {
   flexDirection: 'row',
   alignItems: 'center',
   paddingVertical: 20,
   borderTopWidth: 1,
   borderBottomWidth: 1,
   borderColor: '#eee',
   justifyContent: 'space-around',
 },
 detailItem: {
   alignItems: 'center',
   flex: 1,
 },
 detailSeparator: {
   width: 1,
   height: '100%',
   backgroundColor: '#eee',
 },
 detailValue: {
   fontSize: 18,
   fontWeight: '600',
   color: '#333',
   marginTop: 5,
 },
 detailLabel: {
   color: '#666',
   fontSize: 14,
   marginTop: 4,
 },
 additionalInfo: {
   marginTop: 20,
 },
 infoItem: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 10,
 },
 infoText: {
   marginLeft: 10,
   color: '#666',
   fontSize: 16,
 },
 logoutButton: {
   flexDirection: 'row',
   backgroundColor: 'rgba(244, 81, 30, 0.9)',
   padding: 15,
   borderRadius: 10,
   justifyContent: 'center',
   alignItems: 'center',
   alignSelf: 'stretch',
 },
 logoutText: {
   color: '#fff',
   fontSize: 16,
   fontWeight: '600',
   marginLeft: 8,
 },
 errorText: {
   color: '#fff',
   textAlign: 'center',
   fontSize: 16,
   marginTop: 10,
 },
 retryButton: {
   backgroundColor: '#fff',
   paddingHorizontal: 20,
   paddingVertical: 10,
   borderRadius: 8,
   marginTop: 15,
 },
 retryText: {
   color: '#f4511e',
   fontSize: 16,
   fontWeight: '600',
 },
});
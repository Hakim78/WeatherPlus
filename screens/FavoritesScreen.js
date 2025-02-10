import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = React.useState([]);

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={50} color="gray" />
          <Text style={styles.emptyText}>Aucune ville favorite</Text>
          <Text style={styles.subText}>
            Les villes que vous ajoutez aux favoris apparaîtront ici
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            // la on affiche le rendu des favoris
            <View />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});
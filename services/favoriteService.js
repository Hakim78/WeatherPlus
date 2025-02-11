const BASE_URL = 'http://192.168.1.20:4000/favoris';

const favoriteService = {
  // Récupérer la liste des favoris de l'utilisateur
  listFavorites: async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des favoris');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Ajouter un favori (l'objet favorite doit contenir { id_ville, nom_ville })
  addFavorite: async (favorite, token) => {
    try {
      const response = await fetch(`${BASE_URL}/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(favorite),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'ajout du favori");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un favori à partir de l'id_ville
  deleteFavorite: async (id_ville, token) => {
    try {
      const response = await fetch(`${BASE_URL}/delete/${id_ville}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la suppression du favori");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};

export default favoriteService;

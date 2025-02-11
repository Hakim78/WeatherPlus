const dotenv = require("dotenv");
const Favoris = require("../models/favorisModel");

dotenv.config();

// Lister les favoris d'un utilisateur
function listFavoris(req, res) {
  Favoris.find({ id_user: req.user.id })
    .then((favoris) => {
      res.status(200).send(favoris);
    })
    .catch((error) => {
      res.status(400).send({ error: error.message });
    });
}

// Enregistrer un favoris
async function registerFavoris(req, res) {
  try {
    const id_user = req.user.id;
    const { id_ville, nom_ville } = req.body;

    // Vérifier si le favori existe déjà pour cet utilisateur
    const favoriExiste = await Favoris.findOne({ id_user, id_ville });
    if (favoriExiste) {
      return res.status(409).json({ error: "Cette ville est déjà dans vos favoris." });
    }

    // Enregistrement du favori
    const favoris = await Favoris.create({ id_user, id_ville, nom_ville });
    res.status(201).send(favoris);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

// Supprimer un favoris
async function deleteFavoris(req, res) {
  try {
    const { id_ville } = req.params; // Récupérer l'id_ville depuis l'URL
    const id_user = req.user.id; // Récupérer l'id de l'utilisateur depuis le token

    const favoris = await Favoris.findOneAndDelete({ id_user, id_ville });

    if (!favoris) {
      return res.status(404).json({ error: "Favori non trouvé." });
    }

    res.status(200).json({ message: "Favori supprimé avec succès.", favoris });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}


module.exports = { listFavoris, registerFavoris, deleteFavoris };
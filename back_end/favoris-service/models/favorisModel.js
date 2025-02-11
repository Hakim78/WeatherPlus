const mongoose = require("mongoose");

const favorisSchema = new mongoose.Schema({
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  id_ville: {
    type: String,
    required: true,
  },
  nom_ville: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Exporter le modèle
module.exports = mongoose.model("Favoris", favorisSchema);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/userModel");

dotenv.config();



// Inscription
const registerUser = async (req, res) => {
  try {
    console.log("req.body : " + req.body);
    if (!req.body.password) {
      return res.status(400).send({ error: "Password is required" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      ...req.body,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Connexion
const loginUser = async (req, res) => {
  try {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }
    
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(400).send({ error: "Invalid password" });
    }

    const token = jwt.sign(
      {id: user._id, email: user.email},
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    // res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
    res.status(200).send({ message: "Connexion réussie", token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};


// Récupération de tous les utilisateurs
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    // recuperer l'id depuis le token
    const id = req.params.id;
    console.log(id);
    const user = await User.findById(id);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getMyUser = async (req, res) => {
  try {
    // Vérification que le token est présent
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).send({ error: 'Token manquant ou invalide' });
    }

    // Décodage du token pour récupérer l'id utilisateur
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.id;

    // Recherche de l'utilisateur dans la base de données
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).send({ error: 'Utilisateur introuvable' });
    }

    // Envoi de l'utilisateur en réponse
    res.status(200).send(user);
  } catch (error) {
    // Gestion des erreurs
    res.status(400).send({ error: error.message });
  }
};

// Mise à jour d'un utilisateur
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Suppression d'un utilisateur
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }
    res.status(200).send("Utilisateur supprimé");
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = { registerUser, getUserById, getMyUser, loginUser, getAllUsers, updateUser, deleteUser };
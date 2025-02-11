
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// a changer
const { listFavoris, registerFavoris, deleteFavoris } = require("../controllers/favorisController");

// a changer
router.get("/list", authMiddleware, listFavoris);
router.post("/new", authMiddleware, registerFavoris);
router.delete("/delete/:id_ville", authMiddleware, deleteFavoris);

module.exports = router;


const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {registerUser, loginUser, getUserById, getMyUser } = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getMyUser);
router.get("/:id", getUserById);

module.exports = router;

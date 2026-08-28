const express = require("express");

const {
  register,
  login,
  logout,
  getCurrentUser,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/register", upload.single("profileImage"), register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;

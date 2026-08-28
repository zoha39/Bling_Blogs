const express = require("express");

const {
  getProfile,
  updateProfile,
  uploadProfileImage,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);

router.put("/profile", authMiddleware, updateProfile);

router.post(
  "/profile/image",
  authMiddleware,
  upload.single("image"),
  uploadProfileImage,
);

module.exports = router;

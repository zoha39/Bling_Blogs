const express = require("express");

const {
  createComment,
  getBlogComments,
  getMyResponses,
  deleteComment,
} = require("../controllers/commentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/responses/me", authMiddleware, getMyResponses);

router.get("/:blogId", getBlogComments);

router.post("/:blogId", authMiddleware, createComment);

router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;

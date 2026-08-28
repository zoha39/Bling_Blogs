const express = require("express");

const {
  getBlogs,
  getBlogById,
  getMyBlogs,
  createBlog,
  uploadBlogImage,
  toggleLike,
  updateBlog,
  deleteBlog,
  searchBlogs,
} = require("../controllers/blogController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getBlogs);

router.get("/my", authMiddleware, getMyBlogs);

router.get("/search", searchBlogs);

router.get("/:id", getBlogById);

router.post("/:id/like", authMiddleware, toggleLike);

router.post("/", authMiddleware, createBlog);

router.put("/:id", authMiddleware, updateBlog);

router.delete("/:id", authMiddleware, deleteBlog);

router.post(
  "/upload-image",
  authMiddleware,
  upload.single("image"),
  uploadBlogImage,
);

module.exports = router;

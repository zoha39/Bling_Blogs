const Blog = require("../models/Blog");
const { validateBlogData } = require("../validation/blogValidation");

const cloudinary = require("../config/cloudinary");

const { extractYouTubeVideoId } = require("../utils/youtube");

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("Get blogs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs.",
    });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "name profileImage",
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Get blog error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch blog.",
    });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit this blog.",
      });
    }

    const errors = validateBlogData({
      title,
      content,
    });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please fix the validation errors.",
        errors,
      });
    }

    blog.title = title.trim();
    blog.content = content;

    await blog.save();

    const updatedBlog = await Blog.findById(blog._id).populate(
      "author",
      "name profileImage",
    );

    res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Update blog error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update blog.",
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this blog.",
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully.",
    });
  } catch (error) {
    console.error("Delete blog error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete blog.",
    });
  }
};

const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    const userId = req.user.id;

    const alreadyLiked = blog.likes.some(
      (likeId) => likeId.toString() === userId.toString(),
    );

    if (alreadyLiked) {
      blog.likes = blog.likes.filter(
        (likeId) => likeId.toString() !== userId.toString(),
      );
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likeCount: blog.likes.length,
    });
  } catch (error) {
    console.error("Toggle like error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update like.",
    });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, content, youtubeUrl } = req.body;

    const errors = validateBlogData({
      title,
      content,
    });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please fix the validation errors.",
        errors,
      });
    }

    const videoId = youtubeUrl ? extractYouTubeVideoId(youtubeUrl) : null;

    if (youtubeUrl && !videoId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid YouTube URL.",
      });
    }

    const blog = await Blog.create({
      author: req.user.id,
      title: title.trim(),
      content,
      youtubeVideo: videoId
        ? {
            videoId,
            originalUrl: youtubeUrl,
          }
        : null,
    });

    const populatedBlog = await Blog.findById(blog._id).populate(
      "author",
      "name profileImage",
    );

    res.status(201).json({
      success: true,
      message: "Blog created successfully.",
      blog: populatedBlog,
    });
  } catch (error) {
    console.error("Create blog error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create blog.",
    });
  }
};

const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id })
      .populate("author", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("Get my blogs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch your blogs.",
    });
  }
};

const uploadBlogImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image was provided.",
      });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "bling-blogs",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      uploadStream.end(req.file.buffer);
    });

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully.",
      image: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      },
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload image.",
    });
  }
};

const searchBlogs = async (req, res) => {
  try {
    const searchTerm = req.query.q?.trim();

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: "Search term is required.",
      });
    }

    const blogs = await Blog.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },

      {
        $unwind: "$author",
      },

      {
        $match: {
          $or: [
            {
              title: {
                $regex: searchTerm,
                $options: "i",
              },
            },
            {
              "author.name": {
                $regex: searchTerm,
                $options: "i",
              },
            },
          ],
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $project: {
          title: 1,
          content: 1,
          images: 1,
          likes: 1,
          youtubeVideo: 1,
          createdAt: 1,
          updatedAt: 1,
          author: {
            _id: "$author._id",
            name: "$author.name",
            profileImage: "$author.profileImage",
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("Search blogs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to search blogs.",
    });
  }
};

module.exports = {
  getBlogs,
  getBlogById,
  getMyBlogs,
  createBlog,
  uploadBlogImage,
  toggleLike,
  updateBlog,
  deleteBlog,
  searchBlogs,
};

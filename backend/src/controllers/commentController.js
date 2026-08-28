const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { blogId } = req.params;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty.",
      });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    const comment = await Comment.create({
      blog: blogId,
      author: req.user.id,
      content: content.trim(),
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      "author",
      "name profileImage",
    );

    res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("Create comment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add comment.",
    });
  }
};

const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    const comments = await Comment.find({ blog: blogId })
      .populate("author", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Get comments error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch comments.",
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this comment.",
      });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.error("Delete comment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete comment.",
    });
  }
};

const getMyResponses = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate({
        path: "blog",
        match: { author: req.user.id },
        select: "title",
      })
      .populate("author", "name profileImage")
      .sort({ createdAt: -1 });

    const responses = comments.filter((comment) => comment.blog !== null);

    res.status(200).json({
      success: true,
      responses,
    });
  } catch (error) {
    console.error("Get responses error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch responses.",
    });
  }
};

module.exports = {
  createComment,
  getBlogComments,
  getMyResponses,
  deleteComment,
};

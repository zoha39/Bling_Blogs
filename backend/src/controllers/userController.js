const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email profileImage about createdAt updatedAt",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile.",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, about } = req.body;

    const trimmedName = name?.trim();

    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    if (trimmedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters long.",
      });
    }

    if (trimmedName.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Name cannot exceed 50 characters.",
      });
    }

    if (about && about.trim().length > 500) {
      return res.status(400).json({
        success: false,
        message: "About cannot exceed 500 characters.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.name = trimmedName;
    user.about = about?.trim() || "";

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        about: user.about,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};

const uploadProfileImage = async (req, res) => {
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
          folder: "bling-blogs/profiles",
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

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.profileImage = uploadResult.secure_url;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        about: user.about,
      },
    });
  } catch (error) {
    console.error("Profile image upload error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload profile image.",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage,
};

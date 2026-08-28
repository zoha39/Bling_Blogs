const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    content: {
      type: String,
      required: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    images: [
      {
        url: {
          type: String,
          required: true,
        },

        publicId: {
          type: String,
        },

        alt: {
          type: String,
          default: "",
        },
      },
    ],

    youtubeVideo: {
      videoId: {
        type: String,
      },

      originalUrl: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  },
);

blogSchema.index({ author: 1 });
blogSchema.index({ title: 1 });

module.exports = mongoose.model("Blog", blogSchema);

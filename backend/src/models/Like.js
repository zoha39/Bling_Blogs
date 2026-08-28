const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Like user is required"],
    },

    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: [true, "Like blog is required"],
    },
  },
  {
    timestamps: true,
  },
);

likeSchema.index({ user: 1, blog: 1 }, { unique: true });
likeSchema.index({ blog: 1 });

module.exports = mongoose.model("Like", likeSchema);

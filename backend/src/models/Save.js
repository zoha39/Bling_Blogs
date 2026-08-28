const mongoose = require("mongoose");

const saveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Save user is required"],
    },

    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: [true, "Save blog is required"],
    },
  },
  {
    timestamps: true,
  },
);

saveSchema.index({ user: 1, blog: 1 }, { unique: true });
saveSchema.index({ user: 1 });

module.exports = mongoose.model("Save", saveSchema);

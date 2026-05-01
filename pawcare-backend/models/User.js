const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["owner", "admin", "moderator"],
      default: "owner"
    },
    // ADD THESE TWO FIELDS BELOW
    resetCode: { type: String },
    resetCodeExpires: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema, "users");
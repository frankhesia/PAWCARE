const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: "General" },
    content: { type: String, required: true },
    publishedBy: { type: String, default: "Moderator" },

    status: {
      type: String,
      enum: ["pending", "approved", "changes_requested", "rejected", "flagged", "resolved"],
      default: "pending"
    },

    moderatorNotes: { type: String, default: "" },
    flagReason: { type: String, default: "" },

    riskLevel: {
      type: String,
      enum: ["Low", "Needs Review", "High Risk"],
      default: "Needs Review"
    },

    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);
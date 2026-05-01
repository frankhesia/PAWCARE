const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      default: null
    },
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: "General"
    },
    date: {
      type: Date,
      required: true
    },
    notes: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      default: "upcoming"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", scheduleSchema);

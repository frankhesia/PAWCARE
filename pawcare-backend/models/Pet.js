const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["Dog", "Cat"],
      required: true
    },

    breed: {
      type: String,
      required: true
    },

    age: {
      type: String,
      default: ""
    },

    notes: {
      type: String,
      default: ""
    },

    sex: {
      type: String,
      default: ""
    },

    color: {
      type: String,
      default: ""
    },

    dob: {
      type: String,
      default: ""
    },

    weight: {
      type: String,
      default: ""
    },

    microchipId: {
      type: String,
      default: ""
    },

    neutered: {
      type: String,
      default: ""
    },

    vaccinationStatus: {
      type: String,
      default: ""
    },

    lastVetVisit: {
      type: String,
      default: ""
    },

    vetName: {
      type: String,
      default: ""
    },

    food: {
      type: String,
      default: ""
    },

    feedingSchedule: {
      type: String,
      default: ""
    },

    activityLevel: {
      type: String,
      default: ""
    },

    favoriteActivity: {
      type: String,
      default: ""
    },

    behaviorNotes: {
      type: String,
      default: ""
    },

    // --- NEW FIELD FOR AI SYMPTOM CHECKER ---
    medicalHistory: [
      {
        date: { 
          type: Date, 
          default: Date.now 
        },
        symptom: { 
          type: String, 
          default: "" 
        },
        diagnosis: { 
          type: String, 
          default: "" 
        },
        treatment: { 
          type: String, 
          default: "" 
        }
      }
    ]
    // ---------------------------------------
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pet", petSchema);
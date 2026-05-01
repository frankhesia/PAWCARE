const express = require("express");
const router = express.Router();

const {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  getTotalPetCount // <--- 1. Import the new controller function
} = require("../controllers/petController");

// --- ADMIN ROUTES ---
// This MUST come before /:id
router.get("/admin/count", getTotalPetCount); // <--- 2. Add the count route

// --- GENERAL ROUTES ---
// GET all pets
router.get("/", getPets);

// GET single pet
router.get("/:id", getPetById);

// CREATE pet
router.post("/", createPet);

// UPDATE pet
router.put("/:id", updatePet);

// DELETE pet
router.delete("/:id", deletePet);

module.exports = router;
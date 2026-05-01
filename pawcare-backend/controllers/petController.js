const Pet = require("../models/Pet");

exports.getPets = async (req, res) => {
  try {
    const pets = await Pet.find().populate("ownerId", "name email role");
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: "Failed to get pets" });
  }
};

exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate("ownerId", "name email role");

    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    res.json(pet);
  } catch (error) {
    res.status(500).json({ error: "Failed to get pet" });
  }
};

// Get total count of all pets (Admin Only)
exports.getTotalPetCount = async (req, res) => {
  try {
    const count = await Pet.countDocuments();
    res.json({ total: count });
  } catch (error) {
    res.status(500).json({ error: "Failed to count pets" });
  }
};

exports.createPet = async (req, res) => {
  try {
    const {
      ownerId,
      name,
      type,
      breed,
      age,
      notes,
      sex,
      color,
      dob,
      weight,
      microchipId,
      neutered,
      vaccinationStatus,
      lastVetVisit,
      vetName,
      food,
      feedingSchedule,
      activityLevel,
      favoriteActivity,
      behaviorNotes
    } = req.body;

    if (!ownerId || !name || !type || !breed) {
      return res.status(400).json({
        error: "Owner, name, type, and breed are required"
      });
    }

    const pet = await Pet.create({
      ownerId,
      name,
      type,
      breed,
      age,
      notes,
      sex,
      color,
      dob,
      weight,
      microchipId,
      neutered,
      vaccinationStatus,
      lastVetVisit,
      vetName,
      food,
      feedingSchedule,
      activityLevel,
      favoriteActivity,
      behaviorNotes
    });

    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ error: "Failed to create pet" });
  }
};

exports.updatePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    res.json(pet);
  } catch (error) {
    res.status(500).json({ error: "Failed to update pet" });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);

    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    res.json({ message: "Pet deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete pet" });
  }
};
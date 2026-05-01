const Schedule = require("../models/Schedule");
const Pet = require("../models/Pet");
const User = require("../models/User");
const mongoose = require("mongoose");

// @desc    Get all schedules with optional filters
// @route   GET /api/calendar
exports.getSchedules = async (req, res) => {
  try {
    const { ownerId, petId } = req.query;
    const filter = {};

    if (ownerId) filter.ownerId = ownerId;
    if (petId) filter.petId = petId;

    const schedules = await Schedule.find(filter)
      .populate("petId", "name type")
      .populate("ownerId", "name email")
      .sort({ date: 1 });

    res.json(schedules);
  } catch (error) {
    console.error("GET SCHEDULES ERROR:", error);
    res.status(500).json({ error: "Failed to load schedules" });
  }
};

// @desc    Create a new schedule
// @route   POST /api/calendar
exports.createSchedule = async (req, res) => {
  try {
    console.log("--- New Schedule Request Received ---");
    console.log("Body:", req.body);

    const { ownerId, petId, title, category, date, notes, status } = req.body;

    // 1. Basic Validation
    if (!ownerId || !title || !date) {
      return res.status(400).json({ error: "OwnerId, Title, and Date are required." });
    }

    // 2. Validate OwnerId Format
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      console.log("Invalid Owner ID format:", ownerId);
      return res.status(400).json({ error: "Invalid Owner ID format." });
    }

    // 3. Verify Owner exists
    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ error: "Owner not found in database." });
    }

    // 4. Handle petId (Crucial: Prevents crash if petId is empty string or invalid)
    let validPetId = null;
    if (petId && petId.trim() !== "" && petId !== "null") {
      if (mongoose.Types.ObjectId.isValid(petId)) {
        const pet = await Pet.findById(petId);
        if (pet) {
          validPetId = petId;
        } else {
          console.log("Pet ID provided but not found in DB.");
        }
      } else {
        console.log("Invalid Pet ID format provided, setting to null.");
      }
    }

    // 5. Create the record
    const schedule = new Schedule({
      ownerId,
      petId: validPetId,
      title,
      category: category || "Reminder",
      date: new Date(date), // Ensures it is a proper Date object
      notes,
      status: status || "upcoming"
    });

    await schedule.save();

    // 6. Populate for the response
    const populatedSchedule = await Schedule.findById(schedule._id)
      .populate("petId", "name type")
      .populate("ownerId", "name email");

    console.log("Schedule saved successfully!");
    res.status(201).json(populatedSchedule);

  } catch (error) {
    // Log the actual error to your terminal so you can debug
    console.error("CREATE SCHEDULE CRITICAL ERROR:", error);
    res.status(500).json({ error: error.message || "Failed to create schedule" });
  }
};

// @desc    Update a schedule
// @route   PUT /api/calendar/:id
exports.updateSchedule = async (req, res) => {
  try {
    // Validate ID format before updating
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid Schedule ID format" });
    }

    // If petId is being updated, ensure it's handled correctly
    if (req.body.petId === "" || req.body.petId === "null") {
        req.body.petId = null;
    }

    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("petId", "name type")
      .populate("ownerId", "name email");

    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    res.json(schedule);
  } catch (error) {
    console.error("UPDATE SCHEDULE ERROR:", error);
    res.status(500).json({ error: "Failed to update schedule" });
  }
};

// @desc    Delete a schedule
// @route   DELETE /api/calendar/:id
exports.deleteSchedule = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid Schedule ID format" });
    }

    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    res.json({ message: "Schedule removed successfully" });
  } catch (error) {
    console.error("DELETE SCHEDULE ERROR:", error);
    res.status(500).json({ error: "Failed to delete schedule" });
  }
};
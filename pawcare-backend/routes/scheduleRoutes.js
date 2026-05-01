const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");

// ALL routes here are relative to what you defined in server.js
// If server.js has app.use("/api/calendar", ...), then "/" here means "/api/calendar"

// @route   GET /api/calendar
// @desc    Get all schedules (can filter by ownerId or petId via query params)
router.get("/", scheduleController.getSchedules);

// @route   POST /api/calendar
// @desc    Create a new schedule entry
router.post("/", scheduleController.createSchedule);

// @route   PUT /api/calendar/:id
// @desc    Update an existing schedule entry by ID
router.put("/:id", scheduleController.updateSchedule);

// @route   DELETE /api/calendar/:id
// @desc    Delete a schedule entry by ID
router.delete("/:id", scheduleController.deleteSchedule);

module.exports = router;
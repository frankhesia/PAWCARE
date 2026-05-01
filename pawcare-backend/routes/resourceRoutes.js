const express = require("express");
const router = express.Router();
const controller = require("../controllers/resourceController");

router.get("/", controller.getResources);     // Supports ?status=approved or ?status=pending
router.post("/", controller.createResource);   // Handles the role check
router.put("/:id", controller.updateResource); // Used for approving
router.delete("/:id", controller.deleteResource);

module.exports = router;
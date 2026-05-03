const express = require("express");
const router = express.Router();
const catController = require("../controllers/categoryController");

router.get("/", catController.getCategories);
router.post("/", catController.addCategory);
router.delete("/:id", catController.deleteCategory);

module.exports = router;
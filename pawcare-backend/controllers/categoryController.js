const Category = require("../models/Category");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.addCategory = async (req, res) => {
  try {
    const newCat = await Category.create({ name: req.body.name });
    res.status(201).json(newCat);
  } catch (err) { res.status(400).json({ error: "Category already exists" }); }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
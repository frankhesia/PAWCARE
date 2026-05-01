const Resource = require("../models/Resource");

// GET: Fetch resources (supports ?status=approved or ?status=pending)
exports.getResources = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const data = await Resource.find(filter).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST: Create a resource (Pending if Owner, Approved if Moderator)
exports.createResource = async (req, res) => {
  try {
    // We check the 'role' sent from the frontend
    const { role } = req.body;
    
    // Create the resource data and set status based on role
    const resourceData = {
      ...req.body,
      status: (role === 'moderator' || role === 'admin') ? "approved" : "pending"
    };

    const resource = await Resource.create(resourceData);
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT: Update resource (Used by moderators to change status to 'approved')
exports.updateResource = async (req, res) => {
  try {
    const updated = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE: Remove resource
exports.deleteResource = async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
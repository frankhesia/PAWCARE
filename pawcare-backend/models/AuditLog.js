const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema({
  action: String,     // e.g., "Role Updated"
  details: String,    // e.g., "Changed john@email.com to Moderator"
  adminName: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AuditLog", AuditLogSchema);
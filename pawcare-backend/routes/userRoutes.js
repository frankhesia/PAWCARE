const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  loginUser,
  updateUser, 
  deleteUser,
  getAuditLogs,
  sendResetCode,    // New Step 1
  verifyResetCode,  // New Step 2
  resetPassword,    // New Step 3
  googleLogin
} = require("../controllers/userController");

// AUTH & ACCESS ROUTES
router.post("/", createUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);

// --- FORGOT PASSWORD FLOW (EMAIL SYSTEM) ---
router.post("/forgot-password/send", sendResetCode);     // Sends the 6-digit code
router.post("/forgot-password/verify", verifyResetCode); // Verifies if code is correct
router.post("/forgot-password/reset", resetPassword);    // Sets the final new password

// USER DATA ROUTES
router.get("/", getUsers);
router.get("/:id", getUserById);

// ADMIN ACTIONS
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/admin/logs", getAuditLogs);

module.exports = router;
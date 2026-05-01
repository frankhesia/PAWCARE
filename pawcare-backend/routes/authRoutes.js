const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Use .lean() to get a plain JS object, making it easier to send back
    const user = await User.findOne({
      email: email.toLowerCase(),
      password: password
    }).lean();

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // This sends back the user object directly.
    // Your frontend expects 'data.role', so we make sure the user object is the root response.
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // This is what your frontend checks
      message: "Login successful"
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
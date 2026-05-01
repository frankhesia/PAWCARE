const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client("365682408151-r7hqjksu8ta8virbf68el1j5to01il0u.apps.googleusercontent.com");
const User = require("../models/User");
const Pet = require("../models/Pet");
const AuditLog = require("../models/AuditLog");
const nodemailer = require("nodemailer");

// 1. GET USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to get users" });
  }
};

// 2. GET USER BY ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const pets = await Pet.find({ ownerId: user._id });
    res.json({ user, pets });
  } catch (error) {
    res.status(500).json({ error: "Failed to get user" });
  }
};

// 3. CREATE USER (SIGNUP)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    const user = await User.create({ name, email, password, role: role || "owner" });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

// 4. LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
};

// 5. GOOGLE LOGIN
exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: "365682408151-r7hqjksu8ta8virbf68el1j5to01il0u.apps.googleusercontent.com",
    });
    const { name, email } = ticket.getPayload();
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name,
        email: email,
        password: "google-auth-" + Math.random().toString(36).slice(-8),
        role: "owner"
      });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "Google authentication failed" });
  }
};

// 6. FORGOT PASSWORD - STEP 1: SEND CODE
exports.sendResetCode = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "No account found with this email." });

    // Generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    user.resetCodeExpires = Date.now() + 600000; // 10 mins
    await user.save();

    console.log(`DEBUG: Reset code for ${email} is ${resetCode}`);

    // UPDATED CONFIGURATION WITH NEW SYSTEM ADMINISTRATOR EMAIL
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "pawcaresystemadministrator@gmail.com", 
        pass: "weqd buux qdoz jtxh" 
      }
    });

    const mailOptions = {
      from: '"PawCare Support" <pawcaresystemadministrator@gmail.com>',
      to: email,
      subject: "Your Password Reset Code",
      html: `
        <div style="text-align:center; font-family:sans-serif; padding:20px; border:1px solid #f1d6ad; border-radius:20px;">
          <h2 style="color:#5d7a49;">🐾 PawCare Reset</h2>
          <p>You requested to reset your password. Use the verification code below:</p>
          <h1 style="background:#f1d6ad; padding:20px; display:inline-block; border-radius:10px; letter-spacing:5px; color:#4b3428;">${resetCode}</h1>
          <p style="color:#7a6a5a; margin-top:20px;">This code will expire in 10 minutes.</p>
        </div>`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Reset code sent to your email!" });

  } catch (error) {
    console.error("NODEMAILER ERROR:", error);
    res.status(500).json({ error: "Failed to send email. Check backend logs." });
  }
};

// 7. FORGOT PASSWORD - STEP 2: VERIFY CODE
exports.verifyResetCode = async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ 
      email, 
      resetCode: code, 
      resetCodeExpires: { $gt: Date.now() } 
    });
    if (!user) return res.status(400).json({ error: "Invalid or expired reset code." });
    res.json({ message: "Code verified!" });
  } catch (error) {
    res.status(500).json({ error: "Verification failed." });
  }
};

// 8. FORGOT PASSWORD - STEP 3: RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });
    
    user.password = newPassword;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();
    
    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset password." });
  }
};

// 9. ADMIN: UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const { role, adminName } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    
    await AuditLog.create({
      action: "Role Updated",
      details: `Changed ${user.email} role to ${role}`,
      adminName: adminName || "System Admin"
    });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// 10. ADMIN: DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const { adminName } = req.query; 
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await AuditLog.create({
      action: "User Deleted",
      details: `Permanently removed user: ${user.name} (${user.email})`,
      adminName: adminName || "System Admin"
    });

    await Pet.deleteMany({ ownerId: req.params.id });
    res.json({ message: "User and associated pets deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// 11. ADMIN: GET LOGS
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(10);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};
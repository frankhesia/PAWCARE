const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// 1. IMPORT ROUTES
const resourceRoutes = require("./routes/resourceRoutes");
const authRoutes = require("./routes/authRoutes"); 
const userRoutes = require("./routes/userRoutes"); 
const petRoutes = require("./routes/petRoutes"); 
const scheduleRoutes = require("./routes/scheduleRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

const app = express(); // CREATED FIRST

// 2. MIDDLEWARE
app.use(cors()); // NOW THIS WORKS
app.use(express.json());

// 3. REGISTER ROUTES
app.use("/api/resources", resourceRoutes);
app.use("/api/users", authRoutes); 
app.use("/api/pets", petRoutes);   
app.use("/api/manage-users", userRoutes); 
app.use("/api/calendar", scheduleRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/categories", require("./routes/categoryRoutes"));

// 4. CONNECT TO DATABASE
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// 5. START THE SERVER
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
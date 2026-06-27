require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const studentRoutes = require("./routes/students");
const adminRoutes = require("./routes/admin");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to strip Vercel service prefix if present
app.use((req, res, next) => {
  if (req.url.startsWith("/_/backend")) {
    req.url = req.url.replace("/_/backend", "");
  }
  next();
});

// Middleware to check database connection
app.use((req, res, next) => {
  if (req.path === "/" || req.path === "") {
    return next();
  }
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: "Database is not connected. Please check your MONGO_URI environment variable in Vercel settings and ensure MongoDB Atlas whitelists Vercel's IP addresses (0.0.0.0/0)."
    });
  }
  next();
});

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  res.json({ 
    message: "Student Submission API is running.",
    database: dbStatus 
  });
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI environment variable is not defined!");
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("✅ Connected to MongoDB");
    })
    .catch((err) => {
      console.error("❌ MongoDB connection failed:", err.message);
    });
}

// Export for Vercel serverless function
module.exports = app;

// Start server for local development (not on Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

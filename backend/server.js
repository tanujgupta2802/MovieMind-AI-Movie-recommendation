const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables FIRST
console.log("Loading environment variables...");
const envResult = dotenv.config();

if (envResult.error) {
  console.error(" Error loading .env file:", envResult.error);
} else {
  console.log(".env file loaded successfully");
}

// VERIFY ENVIRONMENT VARIABLES
console.log("Environment Check:");
console.log("NODE_ENV:", process.env.NODE_ENV || "not set");
console.log("PORT:", process.env.PORT || "not set");
console.log("TMDB_API_KEY present:", process.env.TMDB_API_KEY ? "YES" : "NO");
console.log(
  "TMDB_API_KEY preview:",
  process.env.TMDB_API_KEY
    ? process.env.TMDB_API_KEY.substring(0, 8) + "..."
    : "NOT FOUND"
);

// Exit if critical env vars missing
if (!process.env.TMDB_API_KEY) {
  console.error(" CRITICAL: TMDB_API_KEY not found!");
  console.error("Make sure your .env file exists and contains:");
  console.error("TMDB_API_KEY=your_api_key_here");
  process.exit(1);
}

// Import routes AFTER environment is verified
const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const recommendationRoutes = require("./routes/recommendations");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:3001",
    "http://localhost:8080",
    "https://movie-mind-ai-movie-recommendation-zeta.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes with /api prefix
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/recommendations", recommendationRoutes);

// COMPATIBILITY: Duplicate routes without /api prefix for frontend
app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/recommendations", recommendationRoutes);

// Environment test route
app.get("/api/env-test", (req, res) => {
  res.json({
    success: true,
    environment: {
      node_env: process.env.NODE_ENV || "not set",
      port: process.env.PORT || "not set",
      tmdb_api_key_present: !!process.env.TMDB_API_KEY,
      tmdb_api_key_preview: process.env.TMDB_API_KEY
        ? process.env.TMDB_API_KEY.substring(0, 8) + "..."
        : "not found",
    },
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    message: "MovieMind API is running!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    tmdb_configured: !!process.env.TMDB_API_KEY,
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "MovieMind API",
    status: "running",
    endpoints: [
      "/api/health",
      "/api/env-test",
      "/api/auth",
      "/api/movies",
      "/api/recommendations",
    ],
  });
});

// 404 handler
app.use((req, res) => {
  console.log(` 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global Error:", error);
  res.status(500).json({
    success: false,
    message: error.message,
  });
});

// Database connection and server startup
const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/moviemind",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(" Connected to MongoDB");

    // Start server
    app.listen(PORT, () => {
      console.log(` MovieMind API server running on port ${PORT}`);
      console.log(` Health check: http://localhost:${PORT}/api/health`);
      console.log(` Environment test: http://localhost:${PORT}/api/env-test`);
      console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error(" Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;

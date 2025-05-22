// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const config = require("./config/config");
const schoolRoutes = require("./routes/schoolRoutes");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./middlewares/logger");

// Initialize express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests, please try again later",
  },
});
app.use(limiter);

// Request logging
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/schools", schoolRoutes);

//Welcome route
app.get("/", (req, res) => {
  res.status(200).send("Hello from School Management - EduCase 🚀");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Resource not found",
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;

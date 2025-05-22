// middlewares/errorHandler.js
const { errorResponse } = require("../utils/responseFormatter");
const logger = require("./logger");

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(
    `${err.name}: ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Handle specific error types
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation error";
  } else if (err.name === "UnauthorizedError") {
    statusCode = 401;
    message = "Unauthorized";
  }

  // Send error response
  res.status(statusCode).json(errorResponse(message, statusCode, err.errors));
};

module.exports = errorHandler;

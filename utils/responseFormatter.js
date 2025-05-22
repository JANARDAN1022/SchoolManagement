// utils/responseFormatter.js
const config = require("../config/config");

/**
 * Format successful response
 * @param {object} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 * @returns {object} Formatted response
 */
const successResponse = (
  data = null,
  message = "Operation successful",
  statusCode = config.response.successCode
) => {
  return {
    success: true,
    statusCode,
    message,
    data,
  };
};

/**
 * Format error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {object} errors - Additional error details
 * @returns {object} Formatted error response
 */
const errorResponse = (
  message = "Internal server error",
  statusCode = config.response.errorCode,
  errors = null
) => {
  return {
    success: false,
    statusCode,
    message,
    errors,
  };
};

module.exports = {
  successResponse,
  errorResponse,
};

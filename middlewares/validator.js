// middlewares/validator.js
const Joi = require("joi");
const { errorResponse } = require("../utils/responseFormatter");

/**
 * Validate request schema
 * @param {object} schema - Validation schema
 * @returns {function} - Middleware function
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return res
        .status(400)
        .json(errorResponse("Validation error", 400, errorDetails));
    }

    next();
  };
};

// School validation schema
const schoolSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(255).messages({
    "string.empty": "School name is required",
    "string.min": "School name must be at least 2 characters long",
    "string.max": "School name cannot exceed 255 characters",
  }),
  address: Joi.string().required().trim().min(5).max(255).messages({
    "string.empty": "Address is required",
    "string.min": "Address must be at least 5 characters long",
    "string.max": "Address cannot exceed 255 characters",
  }),
  latitude: Joi.number().required().min(-90).max(90).messages({
    "number.base": "Latitude must be a number",
    "number.min": "Latitude must be between -90 and 90",
    "number.max": "Latitude must be between -90 and 90",
  }),
  longitude: Joi.number().required().min(-180).max(180).messages({
    "number.base": "Longitude must be a number",
    "number.min": "Longitude must be between -180 and 180",
    "number.max": "Longitude must be between -180 and 180",
  }),
});

// List schools query validation schema
const listSchoolsSchema = Joi.object({
  latitude: Joi.number().required().min(-90).max(90).messages({
    "number.base": "Latitude must be a number",
    "number.min": "Latitude must be between -90 and 90",
    "number.max": "Latitude must be between -90 and 90",
  }),
  longitude: Joi.number().required().min(-180).max(180).messages({
    "number.base": "Longitude must be a number",
    "number.min": "Longitude must be between -180 and 180",
    "number.max": "Longitude must be between -180 and 180",
  }),
});

// Middleware to validate listSchools query parameters
const validateListSchoolsQuery = (req, res, next) => {
  const { error } = listSchoolsSchema.validate(req.query);

  if (error) {
    const errorDetails = error.details.map((detail) => detail.message);
    return res
      .status(400)
      .json(errorResponse("Validation error", 400, errorDetails));
  }

  next();
};

module.exports = {
  validate,
  schoolSchema,
  validateListSchoolsQuery,
};

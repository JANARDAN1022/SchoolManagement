// controllers/schoolController.js
const SchoolModel = require("../models/schoolModel");
const { calculateDistance } = require("../utils/distanceCalculator");
const {
  successResponse,
  errorResponse,
} = require("../utils/responseFormatter");
const logger = require("../middlewares/logger");

class SchoolController {
  /**
   * Add a new school
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Next middleware
   */
  static async addSchool(req, res, next) {
    try {
      const { name, address, latitude, longitude } = req.body;

      // Check if school with same name already exists
      const exists = await SchoolModel.schoolExistsByName(name);
      if (exists) {
        return res
          .status(409)
          .json(errorResponse("School with this name already exists", 409));
      }

      // Add school to database
      const newSchool = await SchoolModel.addSchool({
        name,
        address,
        latitude,
        longitude,
      });

      logger.info(`School added: ${name}`);

      return res
        .status(201)
        .json(successResponse(newSchool, "School added successfully", 201));
    } catch (error) {
      next(error);
    }
  }

  /**
   * List schools sorted by proximity
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - Next middleware
   */
  static async listSchools(req, res, next) {
    try {
      const { latitude, longitude } = req.query;
      const userLat = parseFloat(latitude);
      const userLng = parseFloat(longitude);

      // Get all schools
      const schools = await SchoolModel.getAllSchools();

      // Calculate distances and sort
      const schoolsWithDistance = schools.map((school) => {
        const distance = calculateDistance(
          userLat,
          userLng,
          school.latitude,
          school.longitude
        );

        return {
          ...school,
          distance: parseFloat(distance.toFixed(2)), // Round to 2 decimal places
        };
      });

      // Sort by distance (closest first)
      schoolsWithDistance.sort((a, b) => a.distance - b.distance);

      logger.info(`Schools listed by proximity to (${userLat}, ${userLng})`);

      return res
        .status(200)
        .json(
          successResponse(schoolsWithDistance, "Schools retrieved successfully")
        );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SchoolController;

// routes/schoolRoutes.js
const express = require("express");
const SchoolController = require("../controllers/schoolController");
const {
  validate,
  schoolSchema,
  validateListSchoolsQuery,
} = require("../middlewares/validator");

const router = express.Router();

/**
 * @route POST /addSchool
 * @desc Add a new school
 * @access Public
 */
router.post("/addSchool", validate(schoolSchema), SchoolController.addSchool);

/**
 * @route GET /listSchools
 * @desc List schools sorted by proximity
 * @access Public
 */
router.get(
  "/listSchools",
  validateListSchoolsQuery,
  SchoolController.listSchools
);

module.exports = router;

// models/schoolModel.js
const { pool } = require("../config/database");
const logger = require("../middlewares/logger");

class SchoolModel {
  /**
   * Add a new school to the database
   * @param {object} schoolData - School data (name, address, latitude, longitude)
   * @returns {object} Created school
   */
  static async addSchool(schoolData) {
    try {
      const { name, address, latitude, longitude } = schoolData;

      const query = `
        INSERT INTO schools (name, address, latitude, longitude)
        VALUES (?, ?, ?, ?)
      `;
      const values = [name, address, latitude, longitude];

      const [result] = await pool.execute(query, values);

      return {
        id: result.insertId,
        ...schoolData,
        created_at: new Date(),
      };
    } catch (error) {
      logger.error("Error adding school:", error);
      throw error;
    }
  }

  /**
   * Get all schools from the database
   * @returns {Array} List of schools
   */
  static async getAllSchools() {
    try {
      const query = "SELECT * FROM schools";
      const [schools] = await pool.execute(query);

      return schools;
    } catch (error) {
      logger.error("Error fetching schools:", error);
      throw error;
    }
  }

  /**
   * Check if school exists by name
   * @param {string} name - School name
   * @returns {boolean} True if school exists, false otherwise
   */
  static async schoolExistsByName(name) {
    try {
      const query = "SELECT COUNT(*) as count FROM schools WHERE name = ?";
      const [result] = await pool.execute(query, [name]);

      return result[0].count > 0;
    } catch (error) {
      logger.error("Error checking school existence:", error);
      throw error;
    }
  }
}

module.exports = SchoolModel;

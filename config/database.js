// config/database.js
const mysql = require("mysql2/promise");
const logger = require("../middlewares/logger");

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    logger.info("Database connection successful");
    connection.release();
    return true;
  } catch (error) {
    logger.error("Database connection failed:", error);
    return false;
  }
}

module.exports = {
  pool,
  testConnection,
};

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

async function initDB() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        latitude FLOAT(10,6) NOT NULL,
        longitude FLOAT(10,6) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    logger.info("Schools table created or already exists");
    connection.release();
  } catch (error) {
    logger.error("Failed to initialize database:", error);
    throw error; // important to handle failure on startup
  }
}

module.exports = {
  pool,
  testConnection,
  initDB,
};

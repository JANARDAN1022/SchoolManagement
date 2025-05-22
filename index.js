// server.js
const app = require("./app");
const config = require("./config/config");
const { testConnection } = require("./config/database");
const logger = require("./middlewares/logger");

// Set port
const PORT = config.port;

// Start server
async function startServer() {
  try {
    // Test database connection
    const dbConnected = await testConnection();

    if (!dbConnected) {
      logger.error("Failed to connect to database. Exiting...");
      process.exit(1);
    }

    // Start the server if database connection is successful
    app.listen(PORT, () => {
      logger.info(`Server running in ${config.env} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Server initialization failed:", error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION:", err);
  // Close server & exit process
  process.exit(1);
});

// Start the server
startServer();

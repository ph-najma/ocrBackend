// src/server.ts
import dotenv from "dotenv";
import app from "./app";
import database from "./config/database";
import { logger } from "./utils/logger";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

/**
 * Start the server
 */
async function startServer(): Promise<void> {
  try {
    // Connect to database
    await database.connect();
    logger.info("Database connection established");

    // Start Express server
    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
      logger.info(`API endpoint: http://localhost:${PORT}/api/ocr`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} signal received: closing HTTP server`);

      server.close(async () => {
        logger.info("HTTP server closed");

        try {
          await database.disconnect();
          logger.info("Database connection closed");
          process.exit(0);
        } catch (error) {
          logger.error("Error during shutdown:", error);
          process.exit(1);
        }
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error(
          "Could not close connections in time, forcefully shutting down"
        );
        process.exit(1);
      }, 10000);
    };

    // Handle termination signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle uncaught exceptions
    process.on("uncaughtException", (error: Error) => {
      logger.error("Uncaught Exception:", error);
      gracefulShutdown("UNCAUGHT_EXCEPTION");
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
      logger.error("Unhandled Rejection at:", promise, "reason:", reason);
      gracefulShutdown("UNHANDLED_REJECTION");
    });
  } catch (error: any) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
startServer();

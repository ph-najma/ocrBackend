"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./config/database"));
const logger_1 = require("./utils/logger");
// Load environment variables
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
/**
 * Start the server
 */
async function startServer() {
    try {
        // Connect to database
        await database_1.default.connect();
        logger_1.logger.info("Database connection established");
        // Start Express server
        const server = app_1.default.listen(PORT, () => {
            logger_1.logger.info(`Server is running on port ${PORT}`);
            logger_1.logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
            logger_1.logger.info(`Health check: http://localhost:${PORT}/health`);
            logger_1.logger.info(`API endpoint: http://localhost:${PORT}/api/ocr`);
        });
        // Graceful shutdown
        const gracefulShutdown = async (signal) => {
            logger_1.logger.info(`${signal} signal received: closing HTTP server`);
            server.close(async () => {
                logger_1.logger.info("HTTP server closed");
                try {
                    await database_1.default.disconnect();
                    logger_1.logger.info("Database connection closed");
                    process.exit(0);
                }
                catch (error) {
                    logger_1.logger.error("Error during shutdown:", error);
                    process.exit(1);
                }
            });
            // Force close after 10 seconds
            setTimeout(() => {
                logger_1.logger.error("Could not close connections in time, forcefully shutting down");
                process.exit(1);
            }, 10000);
        };
        // Handle termination signals
        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
        process.on("SIGINT", () => gracefulShutdown("SIGINT"));
        // Handle uncaught exceptions
        process.on("uncaughtException", (error) => {
            logger_1.logger.error("Uncaught Exception:", error);
            gracefulShutdown("UNCAUGHT_EXCEPTION");
        });
        // Handle unhandled promise rejections
        process.on("unhandledRejection", (reason, promise) => {
            logger_1.logger.error("Unhandled Rejection at:", promise, "reason:", reason);
            gracefulShutdown("UNHANDLED_REJECTION");
        });
    }
    catch (error) {
        logger_1.logger.error("Failed to start server:", error);
        process.exit(1);
    }
}
// Start the server
startServer();
//# sourceMappingURL=server.js.map
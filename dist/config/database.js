"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
// src/config/database.ts
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
class Database {
    constructor() {
        this.isConnected = false;
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    async connect() {
        if (this.isConnected) {
            logger_1.logger.info("Already connected to MongoDB");
            return;
        }
        try {
            const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/aadhaar_ocr";
            await mongoose_1.default.connect(mongoUri);
            this.isConnected = true;
            logger_1.logger.info("Successfully connected to MongoDB");
            // Handle connection events
            mongoose_1.default.connection.on("error", (error) => {
                logger_1.logger.error("MongoDB connection error:", error);
            });
            mongoose_1.default.connection.on("disconnected", () => {
                logger_1.logger.warn("MongoDB disconnected");
                this.isConnected = false;
            });
            mongoose_1.default.connection.on("reconnected", () => {
                logger_1.logger.info("MongoDB reconnected");
                this.isConnected = true;
            });
            // Handle process termination
            process.on("SIGINT", async () => {
                await this.disconnect();
                process.exit(0);
            });
        }
        catch (error) {
            logger_1.logger.error("Failed to connect to MongoDB:", error);
            throw new Error(`Database connection failed: ${error.message}`);
        }
    }
    async disconnect() {
        if (!this.isConnected) {
            return;
        }
        try {
            await mongoose_1.default.disconnect();
            this.isConnected = false;
            logger_1.logger.info("Disconnected from MongoDB");
        }
        catch (error) {
            logger_1.logger.error("Error disconnecting from MongoDB:", error);
            throw error;
        }
    }
    getConnectionState() {
        return this.isConnected;
    }
}
exports.Database = Database;
exports.default = Database.getInstance();
//# sourceMappingURL=database.js.map
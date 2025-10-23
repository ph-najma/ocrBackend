// src/config/database.ts
import mongoose from "mongoose";
import { logger } from "../utils/logger";

export class Database {
  private static instance: Database;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      logger.info("Already connected to MongoDB");
      return;
    }

    try {
      const mongoUri =
        process.env.MONGODB_URI || "mongodb://localhost:27017/aadhaar_ocr";

      await mongoose.connect(mongoUri);

      this.isConnected = true;
      logger.info("Successfully connected to MongoDB");

      // Handle connection events
      mongoose.connection.on("error", (error) => {
        logger.error("MongoDB connection error:", error);
      });

      mongoose.connection.on("disconnected", () => {
        logger.warn("MongoDB disconnected");
        this.isConnected = false;
      });

      mongoose.connection.on("reconnected", () => {
        logger.info("MongoDB reconnected");
        this.isConnected = true;
      });

      // Handle process termination
      process.on("SIGINT", async () => {
        await this.disconnect();
        process.exit(0);
      });
    } catch (error: any) {
      logger.error("Failed to connect to MongoDB:", error);
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info("Disconnected from MongoDB");
    } catch (error: any) {
      logger.error("Error disconnecting from MongoDB:", error);
      throw error;
    }
  }

  public getConnectionState(): boolean {
    return this.isConnected;
  }
}

export default Database.getInstance();

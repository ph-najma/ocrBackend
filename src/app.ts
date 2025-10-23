import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import ocrRoutes from "./routes/ocr.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { logger } from "./utils/logger";

export class App {
  private readonly app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Configure global middlewares for security, parsing, compression, rate limiting, and logging.
   */
  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS configuration
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:4200",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    // Compression middleware for performance
    this.app.use(compression());

    // Body parsers
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Rate limiter
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
      message: "Too many requests from this IP, please try again later.",
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use("/api/", limiter);

    // Request logging
    this.app.use((req: Request, _res: Response, next: NextFunction) => {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get("user-agent"),
      });
      next();
    });
  }

  /**
   * Configure all application routes.
   */
  private initializeRoutes(): void {
    // Health check
    this.app.get("/health", (res: Response) => {
      res.status(200).json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
      });
    });

    // OCR routes
    this.app.use("/api/ocr", ocrRoutes);

    // Root endpoint
    this.app.get("/", (res: Response) => {
      res.status(200).json({
        success: true,
        message: "Aadhaar OCR API",
        version: "1.0.0",
        endpoints: {
          health: "/health",
          ocr: "/api/ocr",
        },
      });
    });
  }

  /**
   * Configure error handling for 404 and global exceptions.
   */
  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  /**
   * Return the Express application instance.
   */
  public getApp(): Application {
    return this.app;
  }
}

export default new App().getApp();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const ocr_routes_1 = __importDefault(require("./routes/ocr.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const logger_1 = require("./utils/logger");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    /**
     * Configure global middlewares for security, parsing, compression, rate limiting, and logging.
     */
    initializeMiddleware() {
        // Security middleware
        this.app.use((0, helmet_1.default)());
        // CORS configuration
        this.app.use((0, cors_1.default)({
            origin: process.env.CORS_ORIGIN || "http://localhost:4200",
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }));
        // Compression middleware for performance
        this.app.use((0, compression_1.default)());
        // Body parsers
        this.app.use(express_1.default.json({ limit: "10mb" }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
        // Rate limiter
        const limiter = (0, express_rate_limit_1.default)({
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
            max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
            message: "Too many requests from this IP, please try again later.",
            standardHeaders: true,
            legacyHeaders: false,
        });
        this.app.use("/api/", limiter);
        // Request logging
        this.app.use((req, _res, next) => {
            logger_1.logger.info(`${req.method} ${req.path}`, {
                ip: req.ip,
                userAgent: req.get("user-agent"),
            });
            next();
        });
    }
    /**
     * Configure all application routes.
     */
    initializeRoutes() {
        // Health check
        this.app.get("/health", (res) => {
            res.status(200).json({
                success: true,
                message: "Server is running",
                timestamp: new Date().toISOString(),
            });
        });
        // OCR routes
        this.app.use("/api/ocr", ocr_routes_1.default);
        // Root endpoint
        this.app.get("/", (res) => {
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
    initializeErrorHandling() {
        this.app.use(error_middleware_1.notFoundHandler);
        this.app.use(error_middleware_1.errorHandler);
    }
    /**
     * Return the Express application instance.
     */
    getApp() {
        return this.app;
    }
}
exports.App = App;
exports.default = new App().getApp();
//# sourceMappingURL=app.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = exports.AppError = void 0;
const multer_1 = __importDefault(require("multer"));
const logger_1 = require("../utils/logger");
/**
 * --------------------------------------------------------------------
 * AppError Class
 * --------------------------------------------------------------------
 * Custom error class for handling operational (expected) errors.
 * Extends the native Error object to include HTTP status codes and
 * operational flags for structured error management.
 * --------------------------------------------------------------------
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
/**
 * --------------------------------------------------------------------
 * Global Error Handler Middleware
 * --------------------------------------------------------------------
 * Centralized middleware to handle all application errors gracefully.
 * Handles known error types such as AppError, MulterError, and Mongoose errors.
 * --------------------------------------------------------------------
 */
const errorHandler = (err, req, res, _next) => {
    let statusCode = 500;
    let message = "Internal server error";
    // Handle AppError (custom application errors)
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // Handle Multer file upload errors
    else if (err instanceof multer_1.default.MulterError) {
        statusCode = 400;
        switch (err.code) {
            case "LIMIT_FILE_SIZE":
                message = "File size exceeds the allowed limit.";
                break;
            case "LIMIT_UNEXPECTED_FILE":
                message = "Unexpected file field provided.";
                break;
            default:
                message = err.message;
                break;
        }
    }
    // Handle validation and casting errors (e.g., from Mongoose)
    else if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation error.";
    }
    else if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format.";
    }
    // Log error details for diagnostics
    logger_1.logger.error(`Error: ${message}`, {
        statusCode,
        method: req.method,
        url: req.originalUrl,
        stack: err.stack,
    });
    // Send error response
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
/**
 * --------------------------------------------------------------------
 * 404 Not Found Handler
 * --------------------------------------------------------------------
 * Middleware to handle unmatched routes gracefully.
 * --------------------------------------------------------------------
 */
const notFoundHandler = (req, _res, next) => {
    const error = new AppError(`Route ${req.originalUrl} not found.`, 404);
    next(error);
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=error.middleware.js.map
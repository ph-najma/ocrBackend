import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { logger } from "../utils/logger";

/**
 * --------------------------------------------------------------------
 * AppError Class
 * --------------------------------------------------------------------
 * Custom error class for handling operational (expected) errors.
 * Extends the native Error object to include HTTP status codes and
 * operational flags for structured error management.
 * --------------------------------------------------------------------
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * --------------------------------------------------------------------
 * Global Error Handler Middleware
 * --------------------------------------------------------------------
 * Centralized middleware to handle all application errors gracefully.
 * Handles known error types such as AppError, MulterError, and Mongoose errors.
 * --------------------------------------------------------------------
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Internal server error";

  // Handle AppError (custom application errors)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle Multer file upload errors
  else if (err instanceof multer.MulterError) {
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
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format.";
  }

  // Log error details for diagnostics
  logger.error(`Error: ${message}`, {
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

/**
 * --------------------------------------------------------------------
 * 404 Not Found Handler
 * --------------------------------------------------------------------
 * Middleware to handle unmatched routes gracefully.
 * --------------------------------------------------------------------
 */
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const error = new AppError(`Route ${req.originalUrl} not found.`, 404);
  next(error);
};

import { Request, Response, NextFunction } from "express";
/**
 * --------------------------------------------------------------------
 * AppError Class
 * --------------------------------------------------------------------
 * Custom error class for handling operational (expected) errors.
 * Extends the native Error object to include HTTP status codes and
 * operational flags for structured error management.
 * --------------------------------------------------------------------
 */
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    constructor(message: string, statusCode: number);
}
/**
 * --------------------------------------------------------------------
 * Global Error Handler Middleware
 * --------------------------------------------------------------------
 * Centralized middleware to handle all application errors gracefully.
 * Handles known error types such as AppError, MulterError, and Mongoose errors.
 * --------------------------------------------------------------------
 */
export declare const errorHandler: (err: Error | AppError, req: Request, res: Response, _next: NextFunction) => void;
/**
 * --------------------------------------------------------------------
 * 404 Not Found Handler
 * --------------------------------------------------------------------
 * Middleware to handle unmatched routes gracefully.
 * --------------------------------------------------------------------
 */
export declare const notFoundHandler: (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=error.middleware.d.ts.map
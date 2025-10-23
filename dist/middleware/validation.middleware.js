"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = exports.validateOCRRequest = void 0;
const express_validator_1 = require("express-validator");
const logger_1 = require("../utils/logger");
/**
 * Middleware to validate uploaded OCR files.
 */
const validateOCRRequest = (req, res, next) => {
    try {
        // Ensure files exist in the request
        if (!req.files || typeof req.files !== "object") {
            res.status(400).json({
                success: false,
                message: "No files uploaded.",
            });
            return;
        }
        const files = req.files;
        const frontImage = files["frontImage"]?.[0];
        const backImage = files["backImage"]?.[0];
        // Validate both front and back images are provided
        if (!frontImage || !backImage) {
            res.status(400).json({
                success: false,
                message: "Both front and back images are required.",
            });
            return;
        }
        // File size validation
        const maxSize = parseInt(process.env.MAX_FILE_SIZE || "5242880", 10); // Default 5MB
        if (frontImage.size > maxSize || backImage.size > maxSize) {
            res.status(400).json({
                success: false,
                message: `File size exceeds ${(maxSize / (1024 * 1024)).toFixed(2)}MB limit.`,
            });
            return;
        }
        // MIME type validation
        const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];
        const invalidMime = !allowedMimes.includes(frontImage.mimetype) ||
            !allowedMimes.includes(backImage.mimetype);
        if (invalidMime) {
            res.status(400).json({
                success: false,
                message: "Invalid file type. Only JPEG, JPG, and PNG formats are allowed.",
            });
            return;
        }
        // Proceed if all validations pass
        next();
    }
    catch (error) {
        const err = error;
        logger_1.logger.error("Validation error:", err);
        res.status(400).json({
            success: false,
            message: "Validation failed.",
            error: err.message,
        });
    }
};
exports.validateOCRRequest = validateOCRRequest;
/**
 * Middleware to handle express-validator errors.
 */
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: errors.array(),
        });
        return;
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
//# sourceMappingURL=validation.middleware.js.map
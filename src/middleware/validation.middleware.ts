import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { logger } from "../utils/logger";

/**
 * Middleware to validate uploaded OCR files.
 */
export const validateOCRRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Ensure files exist in the request
    if (!req.files || typeof req.files !== "object") {
      res.status(400).json({
        success: false,
        message: "No files uploaded.",
      });
      return;
    }

    const files = req.files as Record<string, Express.Multer.File[]>;
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
        message: `File size exceeds ${(maxSize / (1024 * 1024)).toFixed(
          2
        )}MB limit.`,
      });
      return;
    }

    // MIME type validation
    const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];
    const invalidMime =
      !allowedMimes.includes(frontImage.mimetype) ||
      !allowedMimes.includes(backImage.mimetype);

    if (invalidMime) {
      res.status(400).json({
        success: false,
        message:
          "Invalid file type. Only JPEG, JPG, and PNG formats are allowed.",
      });
      return;
    }

    // Proceed if all validations pass
    next();
  } catch (error: unknown) {
    const err = error as Error;
    logger.error("Validation error:", err);

    res.status(400).json({
      success: false,
      message: "Validation failed.",
      error: err.message,
    });
  }
};

/**
 * Middleware to handle express-validator errors.
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

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

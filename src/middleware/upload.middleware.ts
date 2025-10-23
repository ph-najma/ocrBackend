import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

/**
 * --------------------------------------------------------------------
 * File Upload Middleware
 * --------------------------------------------------------------------
 * Handles file storage, validation, and upload limits for OCR images.
 * Uses Multer for multipart/form-data handling.
 * --------------------------------------------------------------------
 */

// Ensure uploads directory exists
const UPLOAD_DIR = process.env.UPLOAD_PATH || "./uploads";

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Configure Multer storage strategy
 * - Stores uploaded files in the uploads directory
 * - Generates unique filenames to avoid conflicts
 */
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${extension}`;
    cb(null, filename);
  },
});

/**
 * File filter to restrict uploads to image files only.
 */
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, JPG, and PNG are allowed."));
  }
};

/**
 * Configure Multer instance with storage, file filter, and limits.
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10), // Default 5MB
  },
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
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
if (!fs_1.default.existsSync(UPLOAD_DIR)) {
    fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
}
/**
 * Configure Multer storage strategy
 * - Stores uploaded files in the uploads directory
 * - Generates unique filenames to avoid conflicts
 */
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const extension = path_1.default.extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${extension}`;
        cb(null, filename);
    },
});
/**
 * File filter to restrict uploads to image files only.
 */
const fileFilter = (_req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Invalid file type. Only JPEG, JPG, and PNG are allowed."));
    }
};
/**
 * Configure Multer instance with storage, file filter, and limits.
 */
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10), // Default 5MB
    },
});
//# sourceMappingURL=upload.middleware.js.map
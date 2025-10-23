// src/routes/ocr.routes.ts
import { Router } from "express";
import { AadhaarController } from "../controllers/aadhar.controller";
import { upload } from "../middleware/upload.middleware";
import { validateOCRRequest } from "../middleware/validation.middleware";

const router = Router();
const aadhaarController = new AadhaarController();

/**
 * @route   POST /api/ocr/process
 * @desc    Process Aadhaar card OCR
 * @access  Public
 */
router.post(
  "/process",
  upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
  ]),
  validateOCRRequest,
  aadhaarController.processOCR
);

/**
 * @route   GET /api/ocr/:id
 * @desc    Get Aadhaar record by ID
 * @access  Public
 */
router.get("/:id", aadhaarController.getById);

/**
 * @route   GET /api/ocr
 * @desc    Get all Aadhaar records with pagination
 * @access  Public
 */
router.get("/", aadhaarController.getAll);

/**
 * @route   GET /api/ocr/search
 * @desc    Search Aadhaar records by name
 * @access  Public
 */
router.get("/search/name", aadhaarController.searchByName);

/**
 * @route   DELETE /api/ocr/:id
 * @desc    Delete Aadhaar record
 * @access  Public
 */
router.delete("/:id", aadhaarController.deleteRecord);

export default router;

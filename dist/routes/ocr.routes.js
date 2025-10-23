"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/ocr.routes.ts
const express_1 = require("express");
const aadhar_controller_1 = require("../controllers/aadhar.controller");
const upload_middleware_1 = require("../middleware/upload.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
const aadhaarController = new aadhar_controller_1.AadhaarController();
/**
 * @route   POST /api/ocr/process
 * @desc    Process Aadhaar card OCR
 * @access  Public
 */
router.post("/process", upload_middleware_1.upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
]), validation_middleware_1.validateOCRRequest, aadhaarController.processOCR);
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
exports.default = router;
//# sourceMappingURL=ocr.routes.js.map
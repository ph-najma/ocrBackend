// src/controllers/aadhaar.controller.ts
import { Request, Response } from "express";
import { AadhaarRepository } from "../repositories/aadhar.repository";
import { OCRService } from "../services/aadhar.service";
import { logger } from "../utils/logger";
import fs from "fs/promises";

export class AadhaarController {
  private aadhaarRepository: AadhaarRepository;
  private ocrService: OCRService;

  constructor() {
    this.aadhaarRepository = new AadhaarRepository();
    this.ocrService = new OCRService();
  }

  /**
   * Process Aadhaar card OCR
   */
  processOCR = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate uploaded files
      if (!req.files || typeof req.files !== "object") {
        res.status(400).json({
          success: false,
          message: "Please upload both front and back images",
        });
        return;
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const frontImage = files["frontImage"]?.[0];
      const backImage = files["backImage"]?.[0];

      if (!frontImage || !backImage) {
        res.status(400).json({
          success: false,
          message: "Both front and back images are required",
        });
        return;
      }

      logger.info("Processing Aadhaar card images...");

      // Process OCR
      const ocrResult = await this.ocrService.processAadhaarCard(
        frontImage.path,
        backImage.path
      );

      // Validate extracted data
      const validation = this.ocrService.validateAadhaarData(ocrResult.data);

      if (!validation.isValid) {
        logger.warn("OCR validation failed:", validation.errors);
      }

      // Save to database
      const aadhaarRecord =
        await this.aadhaarRepository.findOrCreateByAadhaarNumber({
          ...ocrResult.data,
          frontImagePath: frontImage.path,
          backImagePath: backImage.path,
          rawFrontText: ocrResult.rawText.front,
          rawBackText: ocrResult.rawText.back,
        });
      console.log(aadhaarRecord);

      logger.info("Aadhaar record saved:", aadhaarRecord._id);

      // Clean up uploaded files (optional - keep for audit)
      // await this.cleanupFiles([frontImage.path, backImage.path]);

      res.status(200).json({
        success: true,
        message: "Aadhaar card processed successfully",
        data: {
          id: aadhaarRecord._id,
          name: aadhaarRecord.name,
          aadhaarNumber: aadhaarRecord.formattedAadhaarNumber,
          dob: aadhaarRecord.dob,
          gender: aadhaarRecord.gender,
          address: aadhaarRecord.address,
          fatherName: aadhaarRecord.fatherName,
          mobileNumber: aadhaarRecord.mobileNumber,
        },
        validation: validation.isValid ? undefined : validation.errors,
      });
    } catch (error: any) {
      logger.error("OCR processing error:", error);

      // Clean up uploaded files on error
      if (req.files && typeof req.files === "object") {
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };
        const filePaths = [
          files["frontImage"]?.[0]?.path,
          files["backImage"]?.[0]?.path,
        ].filter(Boolean) as string[];
        await this.cleanupFiles(filePaths);
      }

      res.status(500).json({
        success: false,
        message: "Failed to process Aadhaar card",
        error: error.message,
      });
    }
  };

  /**
   * Get Aadhaar record by ID
   */
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const record = await this.aadhaarRepository.findById(id);

      if (!record) {
        res.status(404).json({
          success: false,
          message: "Aadhaar record not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: record._id,
          name: record.name,
          aadhaarNumber: record.formattedAadhaarNumber,
          dob: record.dob,
          gender: record.gender,
          address: record.address,
          fatherName: record.fatherName,
          mobileNumber: record.mobileNumber,
          processedAt: record.processedAt,
        },
      });
    } catch (error: any) {
      logger.error("Get Aadhaar record error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve Aadhaar record",
        error: error.message,
      });
    }
  };

  /**
   * Get all Aadhaar records with pagination
   */
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const records = await this.aadhaarRepository.findAll({}, limit, skip);
      const total = await this.aadhaarRepository.count();

      res.status(200).json({
        success: true,
        data: records.map((record) => ({
          id: record._id,
          name: record.name,
          aadhaarNumber: record.formattedAadhaarNumber,
          dob: record.dob,
          gender: record.gender,
          processedAt: record.processedAt,
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      logger.error("Get all records error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve Aadhaar records",
        error: error.message,
      });
    }
  };

  /**
   * Search Aadhaar records by name
   */
  searchByName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.query;

      if (!name || typeof name !== "string") {
        res.status(400).json({
          success: false,
          message: "Name parameter is required",
        });
        return;
      }

      const records = await this.aadhaarRepository.searchByName(name);

      res.status(200).json({
        success: true,
        data: records.map((record) => ({
          id: record._id,
          name: record.name,
          aadhaarNumber: record.formattedAadhaarNumber,
          dob: record.dob,
          gender: record.gender,
        })),
      });
    } catch (error: any) {
      logger.error("Search error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to search Aadhaar records",
        error: error.message,
      });
    }
  };

  /**
   * Delete Aadhaar record
   */
  deleteRecord = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const record = await this.aadhaarRepository.findById(id);
      if (!record) {
        res.status(404).json({
          success: false,
          message: "Aadhaar record not found",
        });
        return;
      }

      // Delete associated files
      const filesToDelete = [
        record.frontImagePath,
        record.backImagePath,
      ].filter(Boolean) as string[];
      await this.cleanupFiles(filesToDelete);

      // Delete record
      await this.aadhaarRepository.delete(id);

      res.status(200).json({
        success: true,
        message: "Aadhaar record deleted successfully",
      });
    } catch (error: any) {
      logger.error("Delete record error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete Aadhaar record",
        error: error.message,
      });
    }
  };

  /**
   * Clean up files
   */
  private async cleanupFiles(filePaths: string[]): Promise<void> {
    for (const filePath of filePaths) {
      try {
        await fs.unlink(filePath);
        logger.info(`Deleted file: ${filePath}`);
      } catch (error) {
        logger.warn(`Failed to delete file: ${filePath}`);
      }
    }
  }
}

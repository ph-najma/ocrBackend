// src/services/ocr.service.ts
import Tesseract from "tesseract.js";
import sharp from "sharp";
import { logger } from "../utils/logger";

export interface OCRResult {
  name?: string;
  aadhaarNumber?: string;
  dob?: string;
  gender?: string;
  address?: string;
  fatherName?: string;
  mobileNumber?: string;
}

export class OCRService {
  /**
   * Process image and extract text using Tesseract
   */
  private async extractText(imagePath: string): Promise<string> {
    try {
      // Preprocess image for better OCR accuracy
      const processedImageBuffer = await sharp(imagePath)
        .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
        .grayscale()
        .normalize()
        .sharpen()
        .toBuffer();

      // Perform OCR
      const {
        data: { text },
      } = await Tesseract.recognize(processedImageBuffer, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            logger.info(`OCR Progress: ${(m.progress * 100).toFixed(2)}%`);
          }
        },
      });

      return text;
    } catch (error: any) {
      logger.error(`Text extraction failed: ${error.message}`);
      throw new Error(`Failed to extract text from image: ${error.message}`);
    }
  }

  /**
   * Extract Aadhaar number from text
   */
  private extractAadhaarNumber(text: string): string | undefined {
    // Pattern for 12-digit Aadhaar number (with or without spaces/hyphens)
    const patterns = [/\b\d{4}\s?\d{4}\s?\d{4}\b/g, /\b\d{12}\b/g];

    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        // Clean and format the Aadhaar number
        const aadhaar = matches[0].replace(/\D/g, "");
        if (aadhaar.length === 12) {
          return aadhaar;
        }
      }
    }

    return undefined;
  }

  /**
   * Extract name from text
   */
  private extractName(text: string): string | undefined {
    // Look for patterns after common labels
    const namePatterns = [
      /(?:Name|NAME)[\s:]+([A-Z][a-zA-Z\s]+)/i,
      /\n([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\n/,
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return undefined;
  }

  /**
   * Extract Date of Birth from text
   */
  private extractDOB(text: string): string | undefined {
    const dobPatterns = [
      /(?:DOB|Date of Birth|Birth)[\s:]+(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i,
      /(?:DOB|Date of Birth|Birth)[\s:]+(\d{2}[\/\-]\d{2}[\/\-]\d{2})/i,
      /\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/,
    ];

    for (const pattern of dobPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return undefined;
  }

  /**
   * Extract Gender from text
   */
  private extractGender(text: string): string | undefined {
    const genderPattern = /(?:Gender|Sex)[\s:]+([MaleFemale]+)/i;
    const match = text.match(genderPattern);

    if (match && match[1]) {
      const gender = match[1].toLowerCase();
      if (gender.includes("male") && !gender.includes("female")) {
        return "Male";
      } else if (gender.includes("female")) {
        return "Female";
      }
    }

    // Direct search
    if (/\bMale\b/i.test(text) && !/\bFemale\b/i.test(text)) {
      return "Male";
    } else if (/\bFemale\b/i.test(text)) {
      return "Female";
    }

    return undefined;
  }

  /**
   * Extract Address from text
   */
  private extractAddress(text: string): string | undefined {
    // Look for address patterns
    const addressPatterns = [
      /(?:Address|Address:|S\/O|D\/O|C\/O)[\s:]+([^\n]+(?:\n[^\n]+)*?)(?=\d{6}|\n\n|$)/i,
    ];

    for (const pattern of addressPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim().replace(/\s+/g, " ");
      }
    }

    return undefined;
  }

  /**
   * Extract Father's Name from text
   */
  private extractFatherName(text: string): string | undefined {
    const fatherPatterns = [/(?:S\/O|Son of|Father)[\s:]+([A-Z][a-zA-Z\s]+)/i];

    for (const pattern of fatherPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return undefined;
  }

  /**
   * Extract Mobile Number from text
   */
  private extractMobileNumber(text: string): string | undefined {
    const mobilePattern = /(?:Mobile|Phone|Contact)[\s:]+(\d{10})/i;
    const match = text.match(mobilePattern);

    if (match && match[1]) {
      return match[1];
    }

    // Look for standalone 10-digit numbers
    const standalonePattern = /\b[6-9]\d{9}\b/;
    const standaloneMatch = text.match(standalonePattern);
    if (standaloneMatch) {
      return standaloneMatch[0];
    }

    return undefined;
  }

  /**
   * Parse OCR text and extract Aadhaar information
   */
  private parseAadhaarData(frontText: string, backText: string): OCRResult {
    const combinedText = `${frontText}\n${backText}`;

    const result: OCRResult = {
      name: this.extractName(frontText),
      aadhaarNumber: this.extractAadhaarNumber(combinedText),
      dob: this.extractDOB(frontText),
      gender: this.extractGender(frontText),
      address: this.extractAddress(backText) || this.extractAddress(frontText),
      fatherName: this.extractFatherName(frontText),
      mobileNumber: this.extractMobileNumber(backText),
    };

    logger.info("Parsed Aadhaar data:", result);
    return result;
  }

  /**
   * Process Aadhaar card images
   */
  async processAadhaarCard(
    frontImagePath: string,
    backImagePath: string
  ): Promise<{ data: OCRResult; rawText: { front: string; back: string } }> {
    try {
      logger.info("Starting OCR processing...");

      // Extract text from both images
      const [frontText, backText] = await Promise.all([
        this.extractText(frontImagePath),
        this.extractText(backImagePath),
      ]);

      logger.info("Text extraction completed");

      // Parse the extracted text
      const data = this.parseAadhaarData(frontText, backText);

      return {
        data,
        rawText: {
          front: frontText,
          back: backText,
        },
      };
    } catch (error: any) {
      logger.error(`OCR processing failed: ${error.message}`);
      throw new Error(`Failed to process Aadhaar card: ${error.message}`);
    }
  }

  /**
   * Validate extracted Aadhaar data
   */
  validateAadhaarData(data: OCRResult): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate Aadhaar number
    if (data.aadhaarNumber) {
      const digits = data.aadhaarNumber.replace(/\D/g, "");
      if (digits.length !== 12) {
        errors.push("Invalid Aadhaar number length");
      }
    } else {
      errors.push("Aadhaar number not found");
    }

    // Validate name
    if (!data.name || data.name.length < 2) {
      errors.push("Invalid or missing name");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

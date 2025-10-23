export interface OCRResult {
    name?: string;
    aadhaarNumber?: string;
    dob?: string;
    gender?: string;
    address?: string;
    fatherName?: string;
    mobileNumber?: string;
}
export declare class OCRService {
    /**
     * Process image and extract text using Tesseract
     */
    private extractText;
    /**
     * Extract Aadhaar number from text
     */
    private extractAadhaarNumber;
    /**
     * Extract name from text
     */
    private extractName;
    /**
     * Extract Date of Birth from text
     */
    private extractDOB;
    /**
     * Extract Gender from text
     */
    private extractGender;
    /**
     * Extract Address from text
     */
    private extractAddress;
    /**
     * Extract Father's Name from text
     */
    private extractFatherName;
    /**
     * Extract Mobile Number from text
     */
    private extractMobileNumber;
    /**
     * Parse OCR text and extract Aadhaar information
     */
    private parseAadhaarData;
    /**
     * Process Aadhaar card images
     */
    processAadhaarCard(frontImagePath: string, backImagePath: string): Promise<{
        data: OCRResult;
        rawText: {
            front: string;
            back: string;
        };
    }>;
    /**
     * Validate extracted Aadhaar data
     */
    validateAadhaarData(data: OCRResult): {
        isValid: boolean;
        errors: string[];
    };
}
//# sourceMappingURL=aadhar.service.d.ts.map
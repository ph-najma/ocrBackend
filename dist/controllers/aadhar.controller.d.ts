import { Request, Response } from "express";
export declare class AadhaarController {
    private aadhaarRepository;
    private ocrService;
    constructor();
    /**
     * Process Aadhaar card OCR
     */
    processOCR: (req: Request, res: Response) => Promise<void>;
    /**
     * Get Aadhaar record by ID
     */
    getById: (req: Request, res: Response) => Promise<void>;
    /**
     * Get all Aadhaar records with pagination
     */
    getAll: (req: Request, res: Response) => Promise<void>;
    /**
     * Search Aadhaar records by name
     */
    searchByName: (req: Request, res: Response) => Promise<void>;
    /**
     * Delete Aadhaar record
     */
    deleteRecord: (req: Request, res: Response) => Promise<void>;
    /**
     * Clean up files
     */
    private cleanupFiles;
}
//# sourceMappingURL=aadhar.controller.d.ts.map
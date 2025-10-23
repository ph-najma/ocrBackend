import { Request, Response, NextFunction } from "express";
/**
 * Middleware to validate uploaded OCR files.
 */
export declare const validateOCRRequest: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware to handle express-validator errors.
 */
export declare const handleValidationErrors: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validation.middleware.d.ts.map
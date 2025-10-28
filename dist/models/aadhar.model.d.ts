import mongoose, { Document } from "mongoose";
export interface IAadhaar extends Document {
    name?: string;
    aadhaarNumber?: string;
    dob?: string;
    gender?: string;
    address?: string;
    fatherName?: string;
    mobileNumber?: string;
    frontImagePath?: string;
    backImagePath?: string;
    rawFrontText?: string;
    rawBackText?: string;
    processedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    formattedAadhaarNumber?: string;
}
export declare const AadhaarModel: mongoose.Model<IAadhaar, {}, {}, {}, mongoose.Document<unknown, {}, IAadhaar, {}, {}> & IAadhaar & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=aadhar.model.d.ts.map
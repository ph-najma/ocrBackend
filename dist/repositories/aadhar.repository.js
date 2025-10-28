"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AadhaarRepository = void 0;
// src/repositories/aadhaar.repository.ts
const aadhar_model_1 = require("../models/aadhar.model");
class AadhaarRepository {
    /**
     * Create a new Aadhaar record
     */
    async findOrCreateByAadhaarNumber(aadhaarData) {
        try {
            if (!aadhaarData.aadhaarNumber) {
                throw new Error("Aadhaar number is required.");
            }
            // Clean Aadhaar number (remove spaces or non-digits)
            const cleanNumber = aadhaarData.aadhaarNumber.replace(/\D/g, "");
            // Check if record already exists
            let existingRecord = await aadhar_model_1.AadhaarModel.findOne({
                aadhaarNumber: cleanNumber,
            }).exec();
            if (existingRecord) {
                console.log("✅ Existing Aadhaar found.");
                return existingRecord;
            }
            // Create a new record if not exists
            const newRecord = new aadhar_model_1.AadhaarModel({
                ...aadhaarData,
                aadhaarNumber: cleanNumber,
            });
            console.log("🆕 Creating new Aadhaar record.");
            return await newRecord.save();
        }
        catch (error) {
            throw new Error(`Failed to find or create Aadhaar record: ${error.message}`);
        }
    }
    /**
     * Find Aadhaar record by ID
     */
    async findById(id) {
        try {
            return await aadhar_model_1.AadhaarModel.findById(id).exec();
        }
        catch (error) {
            throw new Error(`Failed to find Aadhaar record: ${error.message}`);
        }
    }
    /**
     * Find one Aadhaar record by filter
     */
    async findOne(filter) {
        try {
            return await aadhar_model_1.AadhaarModel.findOne(filter).exec();
        }
        catch (error) {
            throw new Error(`Failed to find Aadhaar record: ${error.message}`);
        }
    }
    /**
     * Find all Aadhaar records with optional filtering and pagination
     */
    async findAll(filter = {}, limit = 100, skip = 0) {
        try {
            return await aadhar_model_1.AadhaarModel.find(filter)
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(skip)
                .exec();
        }
        catch (error) {
            throw new Error(`Failed to fetch Aadhaar records: ${error.message}`);
        }
    }
    /**
     * Update Aadhaar record by ID
     */
    async update(id, data) {
        try {
            return await aadhar_model_1.AadhaarModel.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
            }).exec();
        }
        catch (error) {
            throw new Error(`Failed to update Aadhaar record: ${error.message}`);
        }
    }
    /**
     * Delete Aadhaar record by ID
     */
    async delete(id) {
        try {
            const result = await aadhar_model_1.AadhaarModel.findByIdAndDelete(id).exec();
            return result !== null;
        }
        catch (error) {
            throw new Error(`Failed to delete Aadhaar record: ${error.message}`);
        }
    }
    /**
     * Count Aadhaar records
     */
    async count(filter = {}) {
        try {
            return await aadhar_model_1.AadhaarModel.countDocuments(filter).exec();
        }
        catch (error) {
            throw new Error(`Failed to count Aadhaar records: ${error.message}`);
        }
    }
    /**
     * Find Aadhaar record by Aadhaar number
     */
    async findByAadhaarNumber(aadhaarNumber) {
        try {
            const cleanNumber = aadhaarNumber.replace(/\D/g, "");
            return await aadhar_model_1.AadhaarModel.findOne({
                aadhaarNumber: { $regex: cleanNumber, $options: "i" },
            }).exec();
        }
        catch (error) {
            throw new Error(`Failed to find Aadhaar by number: ${error.message}`);
        }
    }
    /**
     * Search Aadhaar records by name
     */
    async searchByName(name, limit = 10) {
        try {
            return await aadhar_model_1.AadhaarModel.find({
                name: { $regex: name, $options: "i" },
            })
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
        }
        catch (error) {
            throw new Error(`Failed to search Aadhaar records: ${error.message}`);
        }
    }
    /**
     * Get recent Aadhaar records
     */
    async getRecent(limit = 10) {
        try {
            return await aadhar_model_1.AadhaarModel.find()
                .sort({ createdAt: -1 })
                .limit(limit)
                .exec();
        }
        catch (error) {
            throw new Error(`Failed to fetch recent records: ${error.message}`);
        }
    }
}
exports.AadhaarRepository = AadhaarRepository;
//# sourceMappingURL=aadhar.repository.js.map
import { IAadhaar } from "../models/aadhar.model";
import { FilterQuery, UpdateQuery } from "mongoose";
export interface IRepository<T> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findOne(filter: FilterQuery<T>): Promise<T | null>;
    findAll(filter?: FilterQuery<T>, limit?: number, skip?: number): Promise<T[]>;
    update(id: string, data: UpdateQuery<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    count(filter?: FilterQuery<T>): Promise<number>;
}
export declare class AadhaarRepository implements IRepository<IAadhaar> {
    /**
     * Create a new Aadhaar record
     */
    create(data: Partial<IAadhaar>): Promise<IAadhaar>;
    /**
     * Find Aadhaar record by ID
     */
    findById(id: string): Promise<IAadhaar | null>;
    /**
     * Find one Aadhaar record by filter
     */
    findOne(filter: FilterQuery<IAadhaar>): Promise<IAadhaar | null>;
    /**
     * Find all Aadhaar records with optional filtering and pagination
     */
    findAll(filter?: FilterQuery<IAadhaar>, limit?: number, skip?: number): Promise<IAadhaar[]>;
    /**
     * Update Aadhaar record by ID
     */
    update(id: string, data: UpdateQuery<IAadhaar>): Promise<IAadhaar | null>;
    /**
     * Delete Aadhaar record by ID
     */
    delete(id: string): Promise<boolean>;
    /**
     * Count Aadhaar records
     */
    count(filter?: FilterQuery<IAadhaar>): Promise<number>;
    /**
     * Find Aadhaar record by Aadhaar number
     */
    findByAadhaarNumber(aadhaarNumber: string): Promise<IAadhaar | null>;
    /**
     * Search Aadhaar records by name
     */
    searchByName(name: string, limit?: number): Promise<IAadhaar[]>;
    /**
     * Get recent Aadhaar records
     */
    getRecent(limit?: number): Promise<IAadhaar[]>;
}
//# sourceMappingURL=aadhar.repository.d.ts.map
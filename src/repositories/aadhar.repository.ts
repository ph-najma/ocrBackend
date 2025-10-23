// src/repositories/aadhaar.repository.ts
import { AadhaarModel, IAadhaar } from "../models/aadhar.model";
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

export class AadhaarRepository implements IRepository<IAadhaar> {
  /**
   * Create a new Aadhaar record
   */
  async create(data: Partial<IAadhaar>): Promise<IAadhaar> {
    try {
      const aadhaar = new AadhaarModel(data);
      return await aadhaar.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("Aadhaar number already exists");
      }
      throw new Error(`Failed to create Aadhaar record: ${error.message}`);
    }
  }

  /**
   * Find Aadhaar record by ID
   */
  async findById(id: string): Promise<IAadhaar | null> {
    try {
      return await AadhaarModel.findById(id).exec();
    } catch (error: any) {
      throw new Error(`Failed to find Aadhaar record: ${error.message}`);
    }
  }

  /**
   * Find one Aadhaar record by filter
   */
  async findOne(filter: FilterQuery<IAadhaar>): Promise<IAadhaar | null> {
    try {
      return await AadhaarModel.findOne(filter).exec();
    } catch (error: any) {
      throw new Error(`Failed to find Aadhaar record: ${error.message}`);
    }
  }

  /**
   * Find all Aadhaar records with optional filtering and pagination
   */
  async findAll(
    filter: FilterQuery<IAadhaar> = {},
    limit: number = 100,
    skip: number = 0
  ): Promise<IAadhaar[]> {
    try {
      return await AadhaarModel.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .exec();
    } catch (error: any) {
      throw new Error(`Failed to fetch Aadhaar records: ${error.message}`);
    }
  }

  /**
   * Update Aadhaar record by ID
   */
  async update(
    id: string,
    data: UpdateQuery<IAadhaar>
  ): Promise<IAadhaar | null> {
    try {
      return await AadhaarModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      }).exec();
    } catch (error: any) {
      throw new Error(`Failed to update Aadhaar record: ${error.message}`);
    }
  }

  /**
   * Delete Aadhaar record by ID
   */
  async delete(id: string): Promise<boolean> {
    try {
      const result = await AadhaarModel.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error: any) {
      throw new Error(`Failed to delete Aadhaar record: ${error.message}`);
    }
  }

  /**
   * Count Aadhaar records
   */
  async count(filter: FilterQuery<IAadhaar> = {}): Promise<number> {
    try {
      return await AadhaarModel.countDocuments(filter).exec();
    } catch (error: any) {
      throw new Error(`Failed to count Aadhaar records: ${error.message}`);
    }
  }

  /**
   * Find Aadhaar record by Aadhaar number
   */
  async findByAadhaarNumber(aadhaarNumber: string): Promise<IAadhaar | null> {
    try {
      const cleanNumber = aadhaarNumber.replace(/\D/g, "");
      return await AadhaarModel.findOne({
        aadhaarNumber: { $regex: cleanNumber, $options: "i" },
      }).exec();
    } catch (error: any) {
      throw new Error(`Failed to find Aadhaar by number: ${error.message}`);
    }
  }

  /**
   * Search Aadhaar records by name
   */
  async searchByName(name: string, limit: number = 10): Promise<IAadhaar[]> {
    try {
      return await AadhaarModel.find({
        name: { $regex: name, $options: "i" },
      })
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();
    } catch (error: any) {
      throw new Error(`Failed to search Aadhaar records: ${error.message}`);
    }
  }

  /**
   * Get recent Aadhaar records
   */
  async getRecent(limit: number = 10): Promise<IAadhaar[]> {
    try {
      return await AadhaarModel.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();
    } catch (error: any) {
      throw new Error(`Failed to fetch recent records: ${error.message}`);
    }
  }
}

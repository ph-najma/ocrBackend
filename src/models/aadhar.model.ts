// src/models/aadhaar.model.ts
import mongoose, { Document, Schema } from "mongoose";

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

const aadhaarSchema = new Schema<IAadhaar>(
  {
    name: {
      type: String,
      trim: true,
      index: true,
    },
    aadhaarNumber: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
    },
    dob: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    address: {
      type: String,
      trim: true,
    },
    fatherName: {
      type: String,
      trim: true,
    },
    mobileNumber: {
      type: String,
      trim: true,
    },
    frontImagePath: {
      type: String,
    },
    backImagePath: {
      type: String,
    },
    rawFrontText: {
      type: String,
    },
    rawBackText: {
      type: String,
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for better query performance
aadhaarSchema.index({ createdAt: -1 });
aadhaarSchema.index({ processedAt: -1 });

// Virtual for formatted Aadhaar number
aadhaarSchema.virtual("formattedAadhaarNumber").get(function () {
  if (!this.aadhaarNumber) return "";
  const digits = this.aadhaarNumber.replace(/\D/g, "");
  if (digits.length === 12) {
    return digits.match(/.{1,4}/g)?.join(" ") || digits;
  }
  return this.aadhaarNumber;
});

// Ensure virtuals are included in JSON
aadhaarSchema.set("toJSON", { virtuals: true });
aadhaarSchema.set("toObject", { virtuals: true });

export const AadhaarModel = mongoose.model<IAadhaar>("Aadhaar", aadhaarSchema);

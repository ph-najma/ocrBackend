"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AadhaarModel = void 0;
// src/models/aadhaar.model.ts
const mongoose_1 = __importStar(require("mongoose"));
const aadhaarSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
    versionKey: false,
});
// Indexes for better query performance
aadhaarSchema.index({ createdAt: -1 });
aadhaarSchema.index({ processedAt: -1 });
// Virtual for formatted Aadhaar number
aadhaarSchema.virtual("formattedAadhaarNumber").get(function () {
    if (!this.aadhaarNumber)
        return "";
    const digits = this.aadhaarNumber.replace(/\D/g, "");
    if (digits.length === 12) {
        return digits.match(/.{1,4}/g)?.join(" ") || digits;
    }
    return this.aadhaarNumber;
});
// Ensure virtuals are included in JSON
aadhaarSchema.set("toJSON", { virtuals: true });
aadhaarSchema.set("toObject", { virtuals: true });
exports.AadhaarModel = mongoose_1.default.model("Aadhaar", aadhaarSchema);
//# sourceMappingURL=aadhar.model.js.map
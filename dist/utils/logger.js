"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
// src/utils/logger.ts
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Create logs directory if it doesn't exist
const logsDir = path_1.default.join(__dirname, "../../logs");
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
// Define log format
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json());
// Define console format
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
        msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
}));
// Create the logger
exports.logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: logFormat,
    defaultMeta: { service: "aadhaar-ocr" },
    transports: [
        // Write all logs to combined.log
        new winston_1.default.transports.File({
            filename: path_1.default.join(logsDir, "combined.log"),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Write errors to error.log
        new winston_1.default.transports.File({
            filename: path_1.default.join(logsDir, "error.log"),
            level: "error",
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
    ],
});
// If not in production, also log to console
if (process.env.NODE_ENV !== "production") {
    exports.logger.add(new winston_1.default.transports.Console({
        format: consoleFormat,
    }));
}
exports.default = exports.logger;
//# sourceMappingURL=logger.js.map
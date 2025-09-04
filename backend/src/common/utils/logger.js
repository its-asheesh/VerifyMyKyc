"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logToFile = void 0;
// src/utils/logger.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const LOG_DIR = path_1.default.join(__dirname, '../logs');
// Ensure logs directory exists
if (!fs_1.default.existsSync(LOG_DIR)) {
    fs_1.default.mkdirSync(LOG_DIR, { recursive: true });
}
const logToFile = (fileName, data) => {
    const filePath = path_1.default.join(LOG_DIR, `${fileName}.jsonl`); // .jsonl = JSON Lines
    const logEntry = JSON.stringify(Object.assign({ timestamp: new Date().toISOString() }, data)) + '\n'; // Append newline for JSONL format
    try {
        fs_1.default.appendFileSync(filePath, logEntry, 'utf-8');
    }
    catch (err) {
        console.error('Failed to write log:', err);
    }
};
exports.logToFile = logToFile;

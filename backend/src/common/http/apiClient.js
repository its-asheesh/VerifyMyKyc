"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
console.log('GRIDLINES_BASE_URL:', process.env.GRIDLINES_BASE_URL); // should be removed in production
// Loads API key and base URL from environment variables
const apiClient = axios_1.default.create({
    baseURL: process.env.GRIDLINES_BASE_URL, // e.g., https://api.gridlines.io
    timeout: 30000, // Increased from 10000 to 30000 (30 seconds)
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-API-Key': process.env.GRIDLINES_API_KEY || '',
        'X-Auth-Type': 'API-Key',
        'X-Reference-ID': `ref_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`, // Generate unique reference ID
    },
});
exports.default = apiClient;

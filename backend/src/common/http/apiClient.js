"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
// Loads API key and base URL from environment variables
const apiClient = axios_1.default.create({
    baseURL: process.env.GRIDLINES_BASE_URL, // e.g., https://api.gridlines.io
    timeout: 30000, // Increased from 10000 to 30000 (30 seconds)
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-API-Key': process.env.GRIDLINES_API_KEY || '',
        'X-Auth-Type': 'API-Key',
    },
});
// Attach per-request X-Reference-ID
apiClient.interceptors.request.use((config) => {
    config.headers = config.headers || {};
    // Generate unique reference ID for each outgoing request
    config.headers['X-Reference-ID'] = `ref_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    return config;
});
exports.default = apiClient;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
/**
 * QuickEKYC API Client
 * Base URL: https://api.quickekyc.com
 */
const quickekycClient = axios_1.default.create({
    baseURL: process.env.QUICKEKYC_BASE_URL || 'https://api.quickekyc.com',
    timeout: 30000, // 30 seconds
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});
// Add API key to every request
quickekycClient.interceptors.request.use((config) => {
    const apiKey = process.env.QUICKEKYC_API_KEY;
    if (!apiKey) {
        throw new Error('QUICKEKYC_API_KEY environment variable is not set');
    }
    // QuickEKYC expects API key in request body as "key"
    // We'll handle this in the provider level
    return config;
});
exports.default = quickekycClient;

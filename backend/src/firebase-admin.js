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
// src/firebase-admin.ts
const admin = __importStar(require("firebase-admin"));
const serviceAccount = __importStar(require("./modules/auth/verifymykyc-5f02e-firebase-adminsdk-fbsvc-41079032c4.json")); // ✅ Direct JSON import
// Initialize only once
if (!admin.apps.length) {
    try {
        // Validate
        if (!serviceAccount.private_key) {
            throw new Error("Service account is missing 'private_key'");
        }
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: "verifymykyc-5f02e",
        });
        console.log("✅ Firebase Admin SDK initialized successfully");
    }
    catch (error) {
        console.error("❌ Firebase Admin SDK initialization failed:", error);
        process.exit(1);
    }
}
exports.default = admin;

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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters long"],
        maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
        type: String,
        required: false, // optional
        lowercase: true,
        trim: true,
        // Normalize empty strings/null to undefined so they don't hit the unique index
        set: (value) => {
            if (typeof value !== 'string')
                return undefined;
            const trimmed = value.trim();
            return trimmed.length > 0 ? trimmed.toLowerCase() : undefined;
        },
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email",
        ],
    },
    phone: {
        type: String,
        required: false,
        unique: true,
        trim: true,
        sparse: true, // ← critical
        match: [/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
    },
    password: {
        type: String,
        required: [false, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false, // Don't include password in queries by default
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    company: {
        type: String,
        trim: true,
        maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    avatar: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLogin: {
        type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerified: {
        type: Boolean,
        default: false,
    },
    emailOtpCode: String,
    emailOtpExpires: Date,
    location: {
        country: String,
        city: String,
        region: String,
        timezone: String,
        ipAddress: String,
    },
    phoneVerified: { type: Boolean, default: false },
    phoneOtpCode: String,
    phoneOtpExpires: Date,
}, {
    timestamps: true,
});
// Indexes
// Make email UNIQUE only when it's a non-empty string
userSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { email: { $exists: true, $type: "string", $ne: "" } } });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
// Hash password before saving
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Only hash the password if it has been modified (or is new)
        if (!this.isModified("password"))
            return next();
        try {
            // Hash password with cost of 12
            const salt = yield bcryptjs_1.default.genSalt(12);
            this.password = yield bcryptjs_1.default.hash(this.password, salt);
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
// Compare password method
userSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcryptjs_1.default.compare(candidatePassword, this.password);
    });
};
// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};
exports.User = mongoose_1.default.model("User", userSchema);

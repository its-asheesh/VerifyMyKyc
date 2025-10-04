"use strict";
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
exports.firebasePhoneLogin = exports.firebasePhoneRegister = exports.getUsersWithLocation = exports.updateUserLocation = exports.getUserLocationAnalytics = exports.getUserStats = exports.toggleUserStatus = exports.updateUserRole = exports.getAllUsers = exports.logout = exports.changePassword = exports.updateProfile = exports.getProfile = exports.resetPasswordWithOtp = exports.sendPasswordResetOtp = exports.verifyEmailOtp = exports.sendEmailOtp = exports.login = exports.register = void 0;
const auth_model_1 = require("./auth.model");
const jwt_1 = require("../../common/utils/jwt");
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const email_1 = require("../../common/services/email");
const firebase_admin_1 = __importDefault(require("../../../firebase-admin"));
// Register new user
exports.register = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, company, phone, location } = req.body;
    // Check if user already exists
    const existingUser = yield auth_model_1.User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
    }
    // Create new user with location data if provided
    const userData = {
        name,
        email,
        password,
        company,
        phone,
        role: 'user' // Default role
    };
    // Add location data if provided
    if (location) {
        userData.location = location;
    }
    const user = yield auth_model_1.User.create(userData);
    // Create email OTP
    const code = String(Math.floor(100000 + Math.random() * 900000));
    user.emailOtpCode = code;
    user.emailOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    yield user.save();
    // Send email (non-blocking – client can always use resend endpoint)
    let otpSent = true;
    try {
        yield (0, email_1.sendEmail)(email, 'Verify your email', (0, email_1.buildOtpEmailHtml)(name, code));
    }
    catch (e) {
        otpSent = false;
        console.error('Email send failed during registration:', (e === null || e === void 0 ? void 0 : e.message) || e);
    }
    res.status(201).json({
        success: true,
        message: otpSent
            ? 'User registered. Please verify your email with the OTP sent.'
            : 'User registered. We could not send the OTP email. Please tap Resend OTP.',
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                phone: user.phone,
                location: user.location,
                emailVerified: user.emailVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            otpSent
        }
    });
}));
// Login user
exports.login = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, location } = req.body;
    // Find user and include password for comparison
    const user = yield auth_model_1.User.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!user.isActive) {
        return res.status(401).json({ message: 'Account is deactivated' });
    }
    // Check password
    const isPasswordValid = yield user.comparePassword(password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Update location data if provided
    if (location) {
        user.location = location;
    }
    // Require verified email
    if (!user.emailVerified) {
        return res.status(401).json({ message: 'Please verify your email to continue' });
    }
    // Generate token
    const token = (0, jwt_1.generateToken)(user);
    // Update last login
    user.lastLogin = new Date();
    yield user.save();
    res.json({
        success: true,
        message: 'Login successful',
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                phone: user.phone,
                location: user.location,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            token
        }
    });
}));
// Send/Resend email OTP
exports.sendEmailOtp = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield auth_model_1.User.findOne({ email });
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    const code = String(Math.floor(100000 + Math.random() * 900000));
    user.emailOtpCode = code;
    user.emailOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    yield user.save();
    yield (0, email_1.sendEmail)(email, 'Verify your email', (0, email_1.buildOtpEmailHtml)(user.name, code));
    res.json({ success: true, message: 'OTP sent to email' });
}));
// Verify email OTP
exports.verifyEmailOtp = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const user = yield auth_model_1.User.findOne({ email });
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    if (!user.emailOtpCode || !user.emailOtpExpires || user.emailOtpExpires < new Date()) {
        return res.status(400).json({ message: 'OTP expired. Please resend.' });
    }
    if (user.emailOtpCode !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }
    user.emailVerified = true;
    user.emailOtpCode = undefined;
    user.emailOtpExpires = undefined;
    user.lastLogin = new Date();
    console.log('Before save - emailVerified:', user.emailVerified);
    yield user.save();
    console.log('After save - emailVerified:', user.emailVerified);
    const token = (0, jwt_1.generateToken)(user);
    res.json({ success: true, message: 'Email verified', data: { token, user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                phone: user.phone,
                emailVerified: user.emailVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            } } });
}));
// Send password reset OTP (non-enumerating)
exports.sendPasswordResetOtp = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield auth_model_1.User.findOne({ email });
    if (user) {
        const code = String(Math.floor(100000 + Math.random() * 900000));
        user.passwordResetToken = code;
        user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
        yield user.save();
        try {
            yield (0, email_1.sendEmail)(email, 'Password reset code', (0, email_1.buildOtpEmailHtml)(user.name, code));
        }
        catch (e) {
            console.error('Password reset email failed:', (e === null || e === void 0 ? void 0 : e.message) || e);
        }
    }
    // Always 200 to prevent account enumeration
    res.json({ success: true, message: 'If an account exists, an OTP has been sent' });
}));
// Reset password with OTP
exports.resetPasswordWithOtp = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, newPassword } = req.body;
    const user = yield auth_model_1.User.findOne({ email }).select('+password');
    if (!user ||
        !user.passwordResetToken ||
        !user.passwordResetExpires ||
        user.passwordResetExpires < new Date() ||
        user.passwordResetToken !== otp) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.emailVerified = true; // ✅ Trust the email since OTP was received
    yield user.save();
    const token = (0, jwt_1.generateToken)(user);
    res.json({
        success: true,
        message: 'Password reset successful',
        data: {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                phone: user.phone,
                emailVerified: user.emailVerified, // now true
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        }
    });
}));
// Get current user profile
exports.getProfile = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json({
        success: true,
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                phone: user.phone,
                avatar: user.avatar,
                lastLogin: user.lastLogin,
                emailVerified: user.emailVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        }
    });
}));
// Update user profile
exports.updateProfile = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, company, phone } = req.body;
    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
        const existingUser = yield auth_model_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already taken' });
        }
    }
    // Update user
    const updatedUser = yield auth_model_1.User.findByIdAndUpdate(req.user._id, {
        name,
        email,
        company,
        phone
    }, { new: true, runValidators: true });
    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                company: updatedUser.company,
                phone: updatedUser.phone,
                avatar: updatedUser.avatar,
                lastLogin: updatedUser.lastLogin,
                emailVerified: updatedUser.emailVerified,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            }
        }
    });
}));
// Change password
exports.changePassword = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = req.body;
    // Get user with password
    const user = yield auth_model_1.User.findById(req.user._id).select('+password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Verify current password
    const isCurrentPasswordValid = yield user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
    }
    // Update password
    user.password = newPassword;
    yield user.save();
    res.json({
        success: true,
        message: 'Password changed successfully'
    });
}));
// Logout (client-side token removal, but we can track it)
exports.logout = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // In a more advanced setup, you might want to blacklist the token
    // For now, we'll just return success
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
}));
// Admin: Get all users (admin only)
exports.getAllUsers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield auth_model_1.User.find({}).select('-password');
    res.json({
        success: true,
        data: {
            users: users.map(user => ({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                phone: user.phone,
                isActive: user.isActive,
                lastLogin: user.lastLogin,
                emailVerified: user.emailVerified,
                location: user.location,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }))
        }
    });
}));
// Admin: Update user role (admin only)
exports.updateUserRole = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }
    const user = yield auth_model_1.User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    user.role = role;
    yield user.save();
    res.json({
        success: true,
        message: 'User role updated successfully',
        data: { user }
    });
}));
// Admin: Toggle user active status (admin only)
exports.toggleUserStatus = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const user = yield auth_model_1.User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }
    user.isActive = !user.isActive;
    yield user.save();
    res.json({
        success: true,
        message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
        data: { user }
    });
}));
// Admin: Get user statistics
exports.getUserStats = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsers = yield auth_model_1.User.countDocuments();
    const activeUsers = yield auth_model_1.User.countDocuments({ isActive: true });
    const inactiveUsers = yield auth_model_1.User.countDocuments({ isActive: false });
    const adminUsers = yield auth_model_1.User.countDocuments({ role: 'admin' });
    const regularUsers = yield auth_model_1.User.countDocuments({ role: 'user' });
    // Get new users this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newUsersThisMonth = yield auth_model_1.User.countDocuments({
        createdAt: { $gte: startOfMonth }
    });
    res.json({
        success: true,
        data: {
            totalUsers,
            activeUsers,
            inactiveUsers,
            adminUsers,
            regularUsers,
            newUsersThisMonth
        }
    });
}));
// Get user location analytics for admin
exports.getUserLocationAnalytics = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get location statistics
    const locationStats = yield auth_model_1.User.aggregate([
        {
            $match: {
                'location.country': { $exists: true, $ne: null }
            }
        },
        {
            $group: {
                _id: '$location.country',
                count: { $sum: 1 },
                cities: { $addToSet: '$location.city' },
                regions: { $addToSet: '$location.region' }
            }
        },
        {
            $project: {
                country: '$_id',
                userCount: '$count',
                cityCount: { $size: '$cities' },
                regionCount: { $size: '$regions' },
                cities: { $slice: ['$cities', 5] }, // Top 5 cities
                regions: { $slice: ['$regions', 5] } // Top 5 regions
            }
        },
        {
            $sort: { userCount: -1 }
        }
    ]);
    // Get total users with location data
    const totalUsersWithLocation = yield auth_model_1.User.countDocuments({
        'location.country': { $exists: true, $ne: null }
    });
    // Get top cities
    const topCities = yield auth_model_1.User.aggregate([
        {
            $match: {
                'location.city': { $exists: true, $ne: null }
            }
        },
        {
            $group: {
                _id: '$location.city',
                count: { $sum: 1 },
                country: { $first: '$location.country' }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $limit: 10
        }
    ]);
    // Get recent location activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentLocationActivity = yield auth_model_1.User.aggregate([
        {
            $match: {
                createdAt: { $gte: thirtyDaysAgo },
                'location.country': { $exists: true, $ne: null }
            }
        },
        {
            $group: {
                _id: {
                    country: '$location.country',
                    date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { '_id.date': -1 }
        }
    ]);
    res.json({
        success: true,
        data: {
            locationStats,
            totalUsersWithLocation,
            topCities,
            recentLocationActivity
        }
    });
}));
// Update user location (called during login/registration)
exports.updateUserLocation = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { country, city, region, timezone, ipAddress } = req.body;
    const user = yield auth_model_1.User.findByIdAndUpdate(userId, {
        location: {
            country,
            city,
            region,
            timezone,
            ipAddress
        }
    }, { new: true, runValidators: true });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json({
        success: true,
        message: 'User location updated successfully',
        data: { user }
    });
}));
// Get users with location details for analytics
exports.getUsersWithLocation = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield auth_model_1.User.find({}).select('-password').sort({ createdAt: -1 });
    const usersWithLocation = users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        phone: user.phone,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        emailVerified: user.emailVerified,
        location: user.location || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }));
    res.json({
        success: true,
        data: {
            users: usersWithLocation
        }
    });
}));
// =============== FIREBASE PHONE REGISTER (New Users Only) ===============
/**
 * Register a NEW user via Firebase Phone Auth
 * Fails if phone number already exists
 */
exports.firebasePhoneRegister = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idToken, name, company, location } = req.body;
    if (!idToken) {
        return res.status(400).json({ message: 'ID token is required' });
    }
    try {
        // 🔐 Verify Firebase ID token
        const decodedToken = yield firebase_admin_1.default.auth().verifyIdToken(idToken);
        const phone = decodedToken.phone_number;
        if (!phone) {
            return res.status(400).json({ message: 'No phone number in token' });
        }
        // 🔍 Check if user already exists
        const existingUser = yield auth_model_1.User.findOne({ phone });
        if (existingUser) {
            return res.status(409).json({
                message: 'User with this phone number already exists. Please log in instead.'
            });
        }
        // ✅ Create new user
        const newUser = new auth_model_1.User({
            name: name || `User ${phone.slice(-4)}`,
            phone,
            company: company || undefined,
            location: location || undefined,
            role: 'user',
            isActive: true,
            phoneVerified: true, // Trust Firebase
        });
        yield newUser.save();
        const token = (0, jwt_1.generateToken)(newUser);
        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: {
                token,
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    phone: newUser.phone,
                    role: newUser.role,
                    company: newUser.company,
                    phoneVerified: newUser.phoneVerified,
                    emailVerified: newUser.emailVerified,
                    createdAt: newUser.createdAt,
                    updatedAt: newUser.updatedAt,
                },
            },
        });
    }
    catch (error) {
        console.error('Firebase phone register error:', error.message || error);
        if (error.code === 'auth/argument-error' || error.name === 'FirebaseTokenError') {
            return res.status(401).json({ message: 'Invalid or expired ID token' });
        }
        res.status(500).json({ message: 'Registration failed' });
    }
}));
// =============== FIREBASE PHONE LOGIN (Client sends ID token) ===============
exports.firebasePhoneLogin = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idToken } = req.body;
    if (!idToken) {
        return res.status(400).json({ message: 'ID token is required' });
    }
    try {
        // 🔐 Verify Firebase ID token
        const decodedToken = yield firebase_admin_1.default.auth().verifyIdToken(idToken);
        // Extract phone number (Firebase guarantees format: +1234567890)
        const phone = decodedToken.phone_number;
        if (!phone) {
            return res.status(400).json({ message: 'No phone number in token' });
        }
        // Find or create user
        let user = yield auth_model_1.User.findOne({ phone });
        if (!user) {
            // Create new user (minimal profile)
            user = new auth_model_1.User({
                name: `User ${phone.slice(-4)}`,
                phone,
                role: 'user',
                isActive: true,
                phoneVerified: true, // ✅ Trust Firebase verification
            });
        }
        else {
            user.lastLogin = new Date();
            user.phoneVerified = true;
        }
        yield user.save();
        // Generate your app's JWT token
        const token = (0, jwt_1.generateToken)(user);
        res.json({
            success: true,
            message: user.isNew ? 'Account created and logged in' : 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    company: user.company,
                    phoneVerified: user.phoneVerified,
                    emailVerified: user.emailVerified,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            },
        });
    }
    catch (error) {
        console.error('Firebase phone login error:', error.message || error);
        // Handle common Firebase errors
        if (error.code === 'auth/argument-error' || error.name === 'FirebaseTokenError') {
            return res.status(401).json({ message: 'Invalid or expired ID token' });
        }
        res.status(500).json({ message: 'Authentication failed' });
    }
}));

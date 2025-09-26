// src/modules/auth/auth.controller.ts
import { Request, Response } from 'express';
import { User, IUser } from './auth.model';
import { generateToken } from '../../common/utils/jwt';
import asyncHandler from '../../common/middleware/asyncHandler';
import admin from '../../config/firebase-admin';
import { redisClient } from '../../config/redis';
import { sendEmail } from '../../utils/sendEmail';

// ────────────────────────────────────────
// 🔹 EXISTING: Traditional Auth (KEEP ALL)
// ────────────────────────────────────────

// Register new user
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, company, phone, location } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  const userData: any = {
    name,
    email,
    password,
    company,
    phone,
    role: 'user'
  };

  if (location) {
    userData.location = location;
  }

  const user = await User.create(userData);
  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        phone: user.phone,
        location: user.location,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    }
  });
});

// Login user
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, location } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (!user.isActive) {
    return res.status(401).json({ message: 'Account is deactivated' });
  }

  // 🔒 Prevent password login for passwordless accounts
  if (!user.password) {
    return res.status(400).json({
      message: "This account uses passwordless login. Please use OTP or Google."
    });
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (location) {
    user.location = location;
  }

  const token = generateToken(user);
  user.lastLogin = new Date();
  await user.save();

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
});

// Get current user profile
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const user = await User.findById(req.user._id);
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
});

// Update user profile
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const { name, email, company, phone } = req.body;

  if (email && email !== req.user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already taken' });
    }
  }

  // @ts-ignore
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name, email, company, phone },
    { new: true, runValidators: true }
  );

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
});

// Change password
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  // @ts-ignore
  const user = await User.findById(req.user._id).select('+password');
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// Logout
export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Admin: Get all users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({}).select('-password');
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
});

// Admin: Update user role
export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.role = role;
  await user.save();

  res.json({
    success: true,
    message: 'User role updated successfully',
    data: { user }
  });
});

// Admin: Toggle user active status
export const toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // @ts-ignore
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: 'Cannot deactivate your own account' });
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    data: { user }
  });
});

// Admin: Get user statistics
export const getUserStats = asyncHandler(async (req: Request, res: Response) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const inactiveUsers = await User.countDocuments({ isActive: false });
  const adminUsers = await User.countDocuments({ role: 'admin' });
  const regularUsers = await User.countDocuments({ role: 'user' });
  
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfMonth } });

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
});

// Get user location analytics
export const getUserLocationAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const locationStats = await User.aggregate([
    { $match: { 'location.country': { $exists: true, $ne: null } } },
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
        cities: { $slice: ['$cities', 5] },
        regions: { $slice: ['$regions', 5] }
      }
    },
    { $sort: { userCount: -1 } }
  ]);

  const totalUsersWithLocation = await User.countDocuments({
    'location.country': { $exists: true, $ne: null }
  });

  const topCities = await User.aggregate([
    { $match: { 'location.city': { $exists: true, $ne: null } } },
    {
      $group: {
        _id: '$location.city',
        count: { $sum: 1 },
        country: { $first: '$location.country' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentLocationActivity = await User.aggregate([
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
    { $sort: { '_id.date': -1 } }
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
});

// Update user location
export const updateUserLocation = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { country, city, region, timezone, ipAddress } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { location: { country, city, region, timezone, ipAddress } },
    { new: true, runValidators: true }
  );

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    success: true,
    message: 'User location updated successfully',
    data: { user }
  });
});

// Get users with location
export const getUsersWithLocation = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
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
    data: { users: usersWithLocation }
  });
});

// ────────────────────────────────────────
// 🔹 NEW: Passwordless Auth (Google, Email OTP, Mobile)
// ────────────────────────────────────────

// 🔵 Google or Mobile Auth via Firebase ID Token
export const firebaseAuth = asyncHandler(async (req: Request, res: Response) => {
  const { idToken } = req.body;

  if (!idToken || typeof idToken !== "string") {
    return res.status(400).json({ message: "ID token is required" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, phone_number: phone, name, picture } = decodedToken;

    if (!email && !phone) {
      return res.status(400).json({ message: "No email or phone found in token" });
    }

    let user = null;

    if (phone) {
      user = await User.findOne({ phone });
      if (!user) {
        user = new User({
          name: name || `User ${phone.slice(-4)}`,
          phone,
          role: "user",
        });
        await user.save();
      }
    } else if (email) {
      user = await User.findOne({ email });
      if (!user) {
        user = new User({
          name: name || email.split("@")[0],
          email: email.toLowerCase().trim(),
          avatar: picture || "",
          role: "user",
        });
        await user.save();
      }
    }

    if (!user) {
      return res.status(500).json({ message: "Failed to process user" });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          company: user.company,
          location: user.location,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error("Firebase Auth Error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

// 📧 Send OTP to Email
export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Valid email is required" });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await redisClient.set(`otp:${normalizedEmail}`, otp, { EX: 600 });
  } catch (err) {
    console.error("Redis error:", err);
    return res.status(500).json({ message: "Failed to generate OTP" });
  }

  try {
    await sendEmail({
      to: normalizedEmail,
      subject: "Your Login Code",
      html: `<p>Your OTP: <strong>${otp}</strong> (expires in 10 minutes)</p>`,
      text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
    });
  } catch (emailErr) {
    console.error("Email sending failed:", emailErr);
  }

  res.json({ success: true, message: "OTP sent to your email" });
});

// ✅ Verify Email OTP & Create/Login User
export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp, password } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const storedOtp = await redisClient.get(`otp:${normalizedEmail}`);

  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  await redisClient.del(`otp:${normalizedEmail}`);

  let user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    user = new User({
      name: normalizedEmail.split("@")[0],
      email: normalizedEmail,
      password: password || undefined,
      company: req.body.company, // Optional
      phone: req.body.phone,     // Optional
      role: "user",
    });
    await user.save();
  }

  const token = generateToken(user);

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        company: user.company,
        location: user.location,
      },
      token,
    },
  });
});

// 🔍 Check if email exists
export const checkEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.query;
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Valid email required" });
  }
  const exists = await User.exists({ email: email.toLowerCase().trim() });
  res.json({ exists: !!exists });
});
import { Request, Response } from 'express';
import { User, IUser } from './auth.model';
import { generateToken } from '../../common/utils/jwt';
import asyncHandler from '../../common/middleware/asyncHandler';
import { buildOtpEmailHtml, sendEmail } from '../../common/services/email';
import admin from '../../firebase-admin';
import { sendGaEvent } from '../../common/services/ga4';

// Helper: notify admins about new user sign-ups
async function notifyAdminsOfNewUser(
  user: any,
  method: 'email' | 'phone',
  status: 'successful' | 'attempted' | 'failed' = 'successful'
) {
  try {
    const recipients = (process.env.ADMIN_NOTIFY_EMAILS || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (!recipients.length) return;
    const lines = [
      `<p><strong>Name:</strong> ${user.name || '-'}</p>`,
      `<p><strong>Email:</strong> ${user.email || '-'}</p>`,
      `<p><strong>Phone:</strong> ${user.phone || '-'}</p>`,
      `<p><strong>Company:</strong> ${user.company || '-'}</p>`,
      `<p><strong>Status:</strong> ${status}</p>`,
    ];
    const html = `<div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#111;">${lines.join('')}</div>`;
    await Promise.all(recipients.map((to) => sendEmail(to, 'New user signed up', html)));
  } catch (e) {
    console.error('Failed to notify admins of new user:', (e as any)?.message || e);
  }
}

// Register new user
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, company, phone, location } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // Attempted registration with existing email
    void notifyAdminsOfNewUser({ name, email, phone, company }, 'email', 'attempted');
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  // Create new user with location data if provided
  const userData: any = {
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

  const user = await User.create(userData);

  // Create email OTP
  const code = String(Math.floor(100000 + Math.random() * 900000));
  user.emailOtpCode = code;
  user.emailOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  await user.save();

  // GA4: user_registered (email flow)
  try {
    await sendGaEvent(String(user._id), 'user_registered', {
      signup_method: 'email',
      role: user.role,
      email_verified: !!user.emailVerified,
      phone_verified: !!user.phoneVerified,
    });
  } catch {}

  // Notify admins (successful registration)
  void notifyAdminsOfNewUser(user, 'email', 'successful');

  // Send email (non-blocking – client can always use resend endpoint)
  let otpSent = true;
  try {
    await sendEmail(email, 'Verify your email', buildOtpEmailHtml(name, code));
  } catch (e: any) {
    otpSent = false;
    console.error('Email send failed during registration:', e?.message || e);
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
});

// Login user — supports email OR phone number in the "email" field
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, location } = req.body;

  // 🔍 Find user by email OR phone
  const user = await User.findOne({
    $or: [
      { email },
      { phone: email } // allow phone number in "email" field
    ]
  }).select('+password');
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (!user.isActive) {
    return res.status(401).json({ message: 'Account is deactivated' });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Update location data if provided
  if (location) {
    user.location = location;
  }

  // 🔐 Require verified email OR verified phone
  if (!user.emailVerified && !user.phoneVerified) {
    return res.status(401).json({ 
      message: 'Please verify your email or phone number to continue' 
    });
  }

  // Generate token
  const token = generateToken(user);

  // Update last login
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
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    }
  });
});

// Send/Resend email OTP
export const sendEmailOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  const code = String(Math.floor(100000 + Math.random() * 900000));
  user.emailOtpCode = code;
  user.emailOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  await sendEmail(email, 'Verify your email', buildOtpEmailHtml(user.name, code));
  res.json({ success: true, message: 'OTP sent to email' });
});

// Verify email OTP
export const verifyEmailOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body as { email: string; otp: string };
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
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
  await user.save();
console.log('After save - emailVerified:', user.emailVerified);
  const token = generateToken(user);
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
});

// Send password reset OTP (non-enumerating)
export const sendPasswordResetOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };
  const user = await User.findOne({ email });
  if (user) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    user.passwordResetToken = code;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    try {
      await sendEmail(email, 'Password reset code', buildOtpEmailHtml(user.name, code));
    } catch (e: any) {
      console.error('Password reset email failed:', e?.message || e);
    }
  }
  // Always 200 to prevent account enumeration
  res.json({ success: true, message: 'If an account exists, an OTP has been sent' });
});

// Reset password with OTP
export const resetPasswordWithOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body as { email: string; otp: string; newPassword: string };
  const user = await User.findOne({ email }).select('+password');
  
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
  await user.save();

  const token = generateToken(user);
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
});

// Reset/update password using Firebase Phone ID token (for phone-registered users)
export const resetPasswordWithPhoneToken = asyncHandler(async (req: Request, res: Response) => {
  const { idToken, newPassword } = req.body as { idToken: string; newPassword: string };

  if (!idToken || !newPassword) {
    return res.status(400).json({ message: 'ID token and newPassword are required' });
  }

  // Basic password rule (keep consistent with client and model validation)
  if (typeof newPassword !== 'string' || newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const phone = (decoded as any).phone_number;
    if (!phone) {
      return res.status(400).json({ message: 'No phone number in token' });
    }

    const user = await User.findOne({ phone }).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    user.phoneVerified = true; // trust Firebase verification
    await user.save();

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Password updated successfully',
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
  } catch (error: any) {
    if (error?.code === 'auth/argument-error' || error?.name === 'FirebaseTokenError') {
      return res.status(401).json({ message: 'Invalid or expired ID token' });
    }
    return res.status(500).json({ message: 'Failed to update password' });
  }
});

// Get current user profile
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
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
  const { name, email, company, phone } = req.body;

  // Check if email is being changed and if it's already taken
  if (email && email !== req.user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already taken' });
    }
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
      company,
      phone
    },
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

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// Logout (client-side token removal, but we can track it)
export const logout = asyncHandler(async (req: Request, res: Response) => {
  // In a more advanced setup, you might want to blacklist the token
  // For now, we'll just return success
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Admin: Get all users (admin only)
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
        phoneVerified: user.phoneVerified,
        location: user.location,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    }
  });
});

// Admin: Update user role (admin only)
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

// Admin: Toggle user active status (admin only)
export const toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Prevent admin from deactivating themselves
  if ((user._id as any).toString() === (req.user._id as any).toString()) {
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

// Admin: Verify user email (admin only)
export const verifyUserEmail = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!user.email) {
    return res.status(400).json({ message: 'User does not have an email address' });
  }

  user.emailVerified = true;
  await user.save();

  res.json({
    success: true,
    message: 'Email verified successfully',
    data: { 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        phone: user.phone,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        location: user.location,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  });
});

// Admin: Verify user phone (admin only)
export const verifyUserPhone = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!user.phone) {
    return res.status(400).json({ message: 'User does not have a phone number' });
  }

  user.phoneVerified = true;
  await user.save();

  res.json({
    success: true,
    message: 'Phone verified successfully',
    data: { 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        phone: user.phone,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        location: user.location,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  });
}); 

// Admin: Add tokens (verification quota) for a user (admin only)
export const addUserTokens = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { verificationType, numberOfTokens, validityDays } = req.body;

  // Validate required fields
  if (!verificationType) {
    return res.status(400).json({ message: 'Verification type is required' });
  }

  if (!numberOfTokens || numberOfTokens <= 0) {
    return res.status(400).json({ message: 'Number of tokens must be greater than 0' });
  }

  if (!validityDays || validityDays <= 0) {
    return res.status(400).json({ message: 'Validity days must be greater than 0' });
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Import Order model
  const { Order } = await import('../orders/order.model');
  const { VerificationPricing } = await import('../pricing/pricing.model');

  // Get verification pricing to get service name
  const pricing = await VerificationPricing.findOne({ verificationType });
  const serviceName = pricing?.title || verificationType.charAt(0).toUpperCase() + verificationType.slice(1) + ' Verification';

  // Generate order ID
  const orderId = `ADMIN-TOKEN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Calculate expiry date
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + validityDays);

  // Create order with verification quota
  const order = new Order({
    userId: user._id,
    orderId,
    orderType: 'verification',
    serviceName,
    serviceDetails: {
      verificationType
    },
    totalAmount: 0, // Admin-added tokens are free
    finalAmount: 0,
    currency: 'INR',
    billingPeriod: 'one-time',
    paymentStatus: 'completed', // Mark as completed since admin is adding it
    paymentMethod: 'admin', // Special payment method for admin-added tokens
    status: 'active',
    startDate,
    endDate,
    verificationQuota: {
      totalAllowed: numberOfTokens,
      used: 0,
      remaining: numberOfTokens,
      validityDays,
      expiresAt: endDate
    }
  });

  await order.save();

  res.json({
    success: true,
    message: `Successfully added ${numberOfTokens} tokens for ${serviceName}`,
    data: {
      order: {
        id: order._id,
        orderId: order.orderId,
        orderNumber: order.orderNumber,
        verificationType,
        serviceName,
        numberOfTokens,
        validityDays,
        expiresAt: endDate,
        remaining: numberOfTokens
      }
    }
  });
});

// Admin: Get user statistics
export const getUserStats = asyncHandler(async (req: Request, res: Response) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const inactiveUsers = await User.countDocuments({ isActive: false });
  const adminUsers = await User.countDocuments({ role: 'admin' });
  const regularUsers = await User.countDocuments({ role: 'user' });
  
  // Get new users this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const newUsersThisMonth = await User.countDocuments({
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
}); 

// Get user location analytics for admin
export const getUserLocationAnalytics = asyncHandler(async (req: Request, res: Response) => {
  // Get location statistics
  const locationStats = await User.aggregate([
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
  const totalUsersWithLocation = await User.countDocuments({
    'location.country': { $exists: true, $ne: null }
  });

  // Get top cities
  const topCities = await User.aggregate([
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
});

// Update user location (called during login/registration)
export const updateUserLocation = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { country, city, region, timezone, ipAddress } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      location: {
        country,
        city,
        region,
        timezone,
        ipAddress
      }
    },
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

// Get users with location details for analytics
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
    data: {
      users: usersWithLocation
    }
  });
}); 

// =============== FIREBASE PHONE REGISTER (New Users Only) ===============
/**
 * Register a NEW user via Firebase Phone Auth
 * Fails if phone number already exists
 */
export const firebasePhoneRegister = asyncHandler(async (req: Request, res: Response) => {
  const { idToken, name, company, location, password } = req.body as {
    idToken: string;
    name?: string;
    company?: string;
    location?: any;
    password?: string; // ✅ Add this
  };

  if (!idToken) {
    return res.status(400).json({ message: 'ID token is required' });
  }

  try {
    // 🔐 Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const phone = decodedToken.phone_number;

    if (!phone) {
      return res.status(400).json({ message: 'No phone number in token' });
    }

    // 🔍 Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      // Attempted registration with existing phone
      void notifyAdminsOfNewUser({ name, email: undefined, phone, company }, 'phone', 'attempted');
      return res.status(409).json({ 
        message: 'User with this phone number already exists. Please log in instead.' 
      });
    }

    // ✅ Create new user - password will be hashed automatically by Mongoose pre-save hook
    const newUser = new User({
      name: name || `User ${phone.slice(-4)}`,
      phone,
      company: company || undefined,
      password: password || undefined, // ✅ Pass password (can be undefined)
      location: location || undefined,
      role: 'user',
      isActive: true,
      phoneVerified: true, // Trust Firebase
    });

    await newUser.save();

    // GA4: user_registered (phone flow)
    try {
      await sendGaEvent(String(newUser._id), 'user_registered', {
        signup_method: 'phone',
        role: newUser.role,
        email_verified: !!newUser.emailVerified,
        phone_verified: !!newUser.phoneVerified,
      });
    } catch {}

    // Notify admins (successful registration)
    void notifyAdminsOfNewUser(newUser, 'phone', 'successful');

    const token = generateToken(newUser);

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

  } catch (error: any) {
    console.error('Firebase phone register error:', error.message || error);
    
    if (error.code === 'auth/argument-error' || error.name === 'FirebaseTokenError') {
      // Failed phone registration (invalid token)
      void notifyAdminsOfNewUser({ name, email: undefined, phone: undefined, company }, 'phone', 'failed');
      return res.status(401).json({ message: 'Invalid or expired ID token' });
    }
    // Handle duplicate key (email unique index) gracefully
    if ((error.code === 11000 || error.name === 'MongoServerError') && String(error.message || '').includes('email_1')) {
      // Attempted phone registration but email duplicate
      void notifyAdminsOfNewUser({ name, email: undefined, phone: undefined, company }, 'phone', 'attempted');
      return res.status(409).json({ message: 'Email already in use' });
    }
    
    // Handle Mongoose validation errors (like password too short)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      void notifyAdminsOfNewUser({ name, email: undefined, phone: undefined, company }, 'phone', 'failed');
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    void notifyAdminsOfNewUser({ name, email: undefined, phone: undefined, company }, 'phone', 'failed');
    res.status(500).json({ message: 'Registration failed' });
  }
});

// =============== FIREBASE PHONE LOGIN (Client sends ID token) ===============
export const firebasePhoneLogin = asyncHandler(async (req: Request, res: Response) => {
  const { idToken } = req.body as { idToken: string };

  if (!idToken) {
    return res.status(400).json({ message: 'ID token is required' });
  }

  try {
    // 🔐 Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Extract phone number (Firebase guarantees format: +1234567890)
    const phone = decodedToken.phone_number;
    if (!phone) {
      return res.status(400).json({ message: 'No phone number in token' });
    }

    // Find or create user
    let user = await User.findOne({ phone });

    if (!user) {
      // Create new user (minimal profile)
      user = new User({
        name: `User ${phone.slice(-4)}`,
        phone,
        role: 'user',
        isActive: true,
        phoneVerified: true, // ✅ Trust Firebase verification
      });
    } else {
      user.lastLogin = new Date();
      user.phoneVerified = true;
    }

    await user.save();

    // Generate your app's JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      message: user.isNew ? 'Account created and logged in' : 'Login successful',
      data: {  // 🔥 FIXED: Added missing 'data' property name
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

  } catch (error: any) {
    console.error('Firebase phone login error:', error.message || error);
    
    // Handle common Firebase errors
    if (error.code === 'auth/argument-error' || error.name === 'FirebaseTokenError') {
      return res.status(401).json({ message: 'Invalid or expired ID token' });
    }
    
    res.status(500).json({ message: 'Authentication failed' });
  }
});

// Make sure this is properly formatted in your auth.controller.ts
export const loginWithPhoneAndPassword = asyncHandler(async (req: Request, res: Response) => {
  const { phone, password } = req.body;
  
  if (!phone || !password) {
    return res.status(400).json({ message: 'Phone and password are required' });
  }
  
  // Find user by phone and select password field
  const user = await User.findOne({ phone }).select('+password');
  if (!user) {
    return res.status(401).json({ message: 'Invalid phone number or password' });
  }
  
  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid phone number or password' });
  }
  
  if (!user.isActive) {
    return res.status(403).json({ message: 'Account is deactivated' });
  }
  
  // Update last login
  user.lastLogin = new Date();
  await user.save();
  
  const token = generateToken(user);
  
  res.json({
    success: true,
    data: { // ✅ Make sure you have the 'data' property
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
      }
    }
  });
});
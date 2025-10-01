import { Request, Response } from 'express';
import { User, IUser } from './auth.model';
import { generateToken } from '../../common/utils/jwt';
import asyncHandler from '../../common/middleware/asyncHandler';
import { buildOtpEmailHtml, sendEmail } from '../../common/services/email';

// Register new user
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, company, phone, location } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
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

// Login user
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, location } = req.body;

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');
  
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

  // Require verified email
  if (!user.emailVerified) {
    return res.status(401).json({ message: 'Please verify your email to continue' });
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
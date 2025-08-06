const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/verifymykyc';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  company: String,
  phone: String,
  avatar: String,
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  emailVerified: { type: Boolean, default: false },
  location: {
    country: String,
    city: String,
    region: String,
    timezone: String,
    ipAddress: String
  }
}, { timestamps: true });

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: String, required: true, unique: true },
  orderNumber: { type: String, unique: true },
  orderType: { type: String, enum: ['verification', 'plan'], required: true },
  serviceName: { type: String, required: true },
  serviceDetails: {
    verificationType: String,
    planName: String,
    planType: { type: String, enum: ['monthly', 'yearly', 'one-time'] },
    features: [String]
  },
  totalAmount: { type: Number, required: true },
  finalAmount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  billingPeriod: { type: String, enum: ['one-time', 'monthly', 'yearly'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, enum: ['card', 'upi', 'netbanking'], required: true },
  transactionId: String,
  status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
  startDate: Date,
  endDate: Date,
  couponApplied: {
    couponId: mongoose.Schema.Types.ObjectId,
    code: String,
    discount: Number,
    discountType: { type: String, enum: ['percentage', 'fixed'] },
    discountValue: Number
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);

// Seed data for users from September 2024 to August 2025
const generateUserSeedData = () => {
  const users = [];
  let cumulativeUsers = 0;
  
  // Monthly user growth data (Sep 2024 - Aug 2025)
  const monthlyGrowth = [
    { month: 'Sep 2024', newUsers: 18 },
    { month: 'Oct 2024', newUsers: 22 },
    { month: 'Nov 2024', newUsers: 25 },
    { month: 'Dec 2024', newUsers: 28 },
    { month: 'Jan 2025', newUsers: 32 },
    { month: 'Feb 2025', newUsers: 35 },
    { month: 'Mar 2025', newUsers: 38 },
    { month: 'Apr 2025', newUsers: 42 },
    { month: 'May 2025', newUsers: 45 },
    { month: 'Jun 2025', newUsers: 48 },
    { month: 'Jul 2025', newUsers: 52 },
    { month: 'Aug 2025', newUsers: 55 }
  ];

  const companies = [
    'TechCorp Solutions', 'Digital Innovations Ltd', 'Smart Systems Inc', 
    'Future Tech Co', 'Innovation Hub', 'Digital Dynamics', 'Tech Pioneers',
    'NextGen Solutions', 'Digital Edge', 'Tech Visionaries', 'Smart Solutions',
    'Future Dynamics', 'Innovation Labs', 'Digital Pioneers', 'Tech Leaders'
  ];

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];
  const regions = ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Gujarat'];

  monthlyGrowth.forEach((monthData, monthIndex) => {
    const monthDate = new Date(2024, 8 + monthIndex, 1); // Start from September 2024
    
    for (let i = 0; i < monthData.newUsers; i++) {
      cumulativeUsers++;
      const userIndex = cumulativeUsers - 1;
      
      const isAdmin = userIndex < 55; // First 55 users are admins (12% of total)
      const isActive = Math.random() > 0.25; // 75% active users
      
      users.push({
        name: `User ${cumulativeUsers}`,
        email: `user${cumulativeUsers}@example.com`,
        password: bcrypt.hashSync('password123', 10),
        role: isAdmin ? 'admin' : 'user',
        company: companies[Math.floor(Math.random() * companies.length)],
        phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        isActive: isActive,
        emailVerified: Math.random() > 0.1, // 90% verified
        location: {
          country: 'India',
          city: cities[Math.floor(Math.random() * cities.length)],
          region: regions[Math.floor(Math.random() * regions.length)],
          timezone: 'Asia/Kolkata',
          ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
        },
        createdAt: new Date(monthDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Random day in month
        updatedAt: new Date()
      });
    }
  });

  return users;
};

// Seed data for orders from September 2024 to August 2025
const generateOrderSeedData = (users) => {
  const orders = [];
  let orderNumber = 1000;
  
  // Monthly revenue and order data (Sep 2024 - Aug 2025)
  const monthlyData = [
    { month: 'Sep 2024', revenue: 45000, totalOrders: 45 },
    { month: 'Oct 2024', revenue: 52000, totalOrders: 52 },
    { month: 'Nov 2024', revenue: 58000, totalOrders: 58 },
    { month: 'Dec 2024', revenue: 65000, totalOrders: 65 },
    { month: 'Jan 2025', revenue: 72000, totalOrders: 72 },
    { month: 'Feb 2025', revenue: 78000, totalOrders: 78 },
    { month: 'Mar 2025', revenue: 85000, totalOrders: 85 },
    { month: 'Apr 2025', revenue: 92000, totalOrders: 92 },
    { month: 'May 2025', revenue: 98000, totalOrders: 98 },
    { month: 'Jun 2025', revenue: 105000, totalOrders: 105 },
    { month: 'Jul 2025', revenue: 112000, totalOrders: 112 },
    { month: 'Aug 2025', revenue: 118000, totalOrders: 118 }
  ];

  const services = [
    'Aadhaar Verification', 'PAN Verification', 'Driving License Verification',
    'GSTIN Verification', 'MCA Verification', 'Bank Account Verification'
  ];

  const paymentMethods = ['card', 'upi', 'netbanking'];
  const paymentStatuses = ['completed', 'pending', 'failed'];
  const orderStatuses = ['active', 'expired', 'cancelled'];

  monthlyData.forEach((monthData, monthIndex) => {
    const monthDate = new Date(2024, 8 + monthIndex, 1); // Start from September 2024
    const avgOrderValue = monthData.revenue / monthData.totalOrders;
    
    for (let i = 0; i < monthData.totalOrders; i++) {
      orderNumber++;
      
      // Select a random user
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      // Generate realistic order amount with some variation
      const baseAmount = avgOrderValue * (0.8 + Math.random() * 0.4); // ±20% variation
      const finalAmount = Math.floor(baseAmount);
      
      const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
      const orderStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      
      orders.push({
        userId: randomUser._id,
        orderId: `ORD${orderNumber}`,
        orderNumber: `ON${orderNumber}`,
        orderType: 'verification',
        serviceName: services[Math.floor(Math.random() * services.length)],
        serviceDetails: {
          verificationType: 'individual',
          planType: 'one-time'
        },
        totalAmount: finalAmount,
        finalAmount: finalAmount,
        currency: 'INR',
        billingPeriod: 'one-time',
        paymentStatus: paymentStatus,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        transactionId: paymentStatus === 'completed' ? `TXN${Math.floor(Math.random() * 1000000)}` : undefined,
        status: orderStatus,
        startDate: new Date(monthDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(monthDate.getTime() + 30 * 24 * 60 * 60 * 1000 + Math.random() * 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(monthDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      });
    }
  });

  return orders;
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Order.deleteMany({});
    
    // Generate and insert users
    console.log('Generating user data...');
    const users = generateUserSeedData();
    const insertedUsers = await User.insertMany(users);
    console.log(`✅ Inserted ${insertedUsers.length} users`);
    
    // Generate and insert orders
    console.log('Generating order data...');
    const orders = generateOrderSeedData(insertedUsers);
    const insertedOrders = await Order.insertMany(orders);
    console.log(`✅ Inserted ${insertedOrders.length} orders`);
    
    // Print summary
    console.log('\n📊 Seed Data Summary:');
    console.log(`Users: ${insertedUsers.length}`);
    console.log(`Orders: ${insertedOrders.length}`);
    console.log(`Date Range: September 2024 - August 2025`);
    console.log(`Admin Users: ${insertedUsers.filter(u => u.role === 'admin').length}`);
    console.log(`Active Users: ${insertedUsers.filter(u => u.isActive).length}`);
    console.log(`Completed Orders: ${insertedOrders.filter(o => o.paymentStatus === 'completed').length}`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('You can now test the analytics graphs with realistic data.');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding
seedDatabase(); 
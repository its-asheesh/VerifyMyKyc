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
Object.defineProperty(exports, "__esModule", { value: true });
const order_model_1 = require("./order.model");
const auth_model_1 = require("../auth/auth.model");
const db_1 = require("../../config/db");
const seedOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        yield (0, db_1.connectDB)();
        // Get existing users
        const users = yield auth_model_1.User.find().limit(10);
        if (users.length === 0) {
            console.log('❌ No users found. Please run seed-users first.');
            process.exit(1);
        }
        // Clear existing orders to force recreate
        yield order_model_1.Order.deleteMany({});
        console.log('🗑️ Cleared existing orders');
        // Generate 1 year of data (March 2023 to February 2024)
        const sampleOrders = [];
        let orderCounter = 1;
        // Helper function to generate random date within a month
        const getRandomDateInMonth = (year, month) => {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
            const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
            return new Date(randomTime);
        };
        // Helper function to get end date based on billing period
        const getEndDate = (startDate, billingPeriod) => {
            const endDate = new Date(startDate);
            switch (billingPeriod) {
                case 'monthly':
                    endDate.setMonth(endDate.getMonth() + 1);
                    break;
                case 'yearly':
                    endDate.setFullYear(endDate.getFullYear() + 1);
                    break;
                default: // one-time
                    endDate.setMonth(endDate.getMonth() + 1);
            }
            return endDate;
        };
        // Service configurations
        const verificationServices = [
            { name: 'Aadhaar Card Verification', type: 'aadhaar', price: 360 },
            { name: 'PAN Card Verification', type: 'pan', price: 250 },
            { name: 'Driving License Verification', type: 'drivinglicense', price: 300 },
            { name: 'GSTIN Verification', type: 'gstin', price: 500 },
            { name: 'Passport Verification', type: 'passport', price: 400 },
            { name: 'Voter ID Verification', type: 'voterid', price: 200 }
        ];
        const planServices = [
            { name: 'Personal Monthly Plan', planName: 'Personal', planType: 'monthly', price: 800, features: ['Aadhaar', 'PAN'] },
            { name: 'Personal Yearly Plan', planName: 'Personal', planType: 'yearly', price: 8000, features: ['Aadhaar', 'PAN'] },
            { name: 'Professional Monthly Plan', planName: 'Professional', planType: 'monthly', price: 1500, features: ['Aadhaar', 'PAN', 'Driving License', 'GSTIN'] },
            { name: 'Professional Yearly Plan', planName: 'Professional', planType: 'yearly', price: 15000, features: ['Aadhaar', 'PAN', 'Driving License', 'GSTIN'] },
            { name: 'Business Monthly Plan', planName: 'Business', planType: 'monthly', price: 2500, features: ['Aadhaar', 'PAN', 'Driving License', 'GSTIN', 'MCA'] },
            { name: 'Business Yearly Plan', planName: 'Business', planType: 'yearly', price: 25000, features: ['Aadhaar', 'PAN', 'Driving License', 'GSTIN', 'MCA'] }
        ];
        const paymentMethods = ['card', 'upi', 'netbanking'];
        const paymentStatuses = ['completed', 'completed', 'completed', 'completed', 'completed', 'pending', 'failed']; // 71% success rate
        // Generate data for each month (March 2023 to February 2024)
        for (let year = 2023; year <= 2024; year++) {
            const startMonth = year === 2023 ? 3 : 1; // March 2023 to February 2024
            const endMonth = year === 2023 ? 12 : 2;
            for (let month = startMonth; month <= endMonth; month++) {
                // Calculate orders for this month (growing trend)
                const baseOrders = 15; // Start with 15 orders
                const growthFactor = month + (year - 2023) * 12 - 2; // Growth over time
                const monthlyOrders = Math.floor(baseOrders + growthFactor * 2 + Math.random() * 10);
                // Generate orders for this month
                for (let i = 0; i < monthlyOrders; i++) {
                    const orderDate = getRandomDateInMonth(year, month);
                    const isPlan = Math.random() < 0.3; // 30% plans, 70% verifications
                    const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
                    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                    const user = users[Math.floor(Math.random() * users.length)];
                    let orderData = {
                        orderId: `ORD${orderCounter.toString().padStart(3, '0')}`,
                        userId: user._id,
                        currency: 'INR',
                        paymentStatus,
                        paymentMethod,
                        transactionId: paymentStatus === 'completed' ? `TXN${orderCounter.toString().padStart(3, '0')}` : undefined,
                        status: paymentStatus === 'completed' ? 'active' : (paymentStatus === 'pending' ? 'active' : 'cancelled'),
                        startDate: orderDate,
                        createdAt: orderDate,
                        updatedAt: orderDate
                    };
                    if (isPlan) {
                        const plan = planServices[Math.floor(Math.random() * planServices.length)];
                        orderData = Object.assign(Object.assign({}, orderData), { orderType: 'plan', serviceName: plan.name, serviceDetails: {
                                planName: plan.planName,
                                planType: plan.planType,
                                features: plan.features
                            }, totalAmount: plan.price, finalAmount: plan.price, billingPeriod: plan.planType, endDate: getEndDate(orderDate, plan.planType) });
                    }
                    else {
                        const service = verificationServices[Math.floor(Math.random() * verificationServices.length)];
                        orderData = Object.assign(Object.assign({}, orderData), { orderType: 'verification', serviceName: service.name, serviceDetails: {
                                verificationType: service.type
                            }, totalAmount: service.price, finalAmount: service.price, billingPeriod: 'one-time', endDate: getEndDate(orderDate, 'one-time') });
                    }
                    sampleOrders.push(orderData);
                    orderCounter++;
                }
            }
        }
        // Add some seasonal variations and special events
        // Diwali season (October-November) - higher sales
        const diwaliOrders = 25;
        for (let i = 0; i < diwaliOrders; i++) {
            const orderDate = getRandomDateInMonth(2023, 10 + Math.floor(Math.random() * 2)); // Oct-Nov
            const isPlan = Math.random() < 0.4; // Higher plan sales during festive season
            const user = users[Math.floor(Math.random() * users.length)];
            let orderData = {
                orderId: `ORD${orderCounter.toString().padStart(3, '0')}`,
                userId: user._id,
                currency: 'INR',
                paymentStatus: 'completed',
                paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
                transactionId: `TXN${orderCounter.toString().padStart(3, '0')}`,
                status: 'active',
                startDate: orderDate,
                createdAt: orderDate,
                updatedAt: orderDate
            };
            if (isPlan) {
                const plan = planServices[Math.floor(Math.random() * planServices.length)];
                orderData = Object.assign(Object.assign({}, orderData), { orderType: 'plan', serviceName: plan.name, serviceDetails: {
                        planName: plan.planName,
                        planType: plan.planType,
                        features: plan.features
                    }, totalAmount: plan.price, finalAmount: plan.price, billingPeriod: plan.planType, endDate: getEndDate(orderDate, plan.planType) });
            }
            else {
                const service = verificationServices[Math.floor(Math.random() * verificationServices.length)];
                orderData = Object.assign(Object.assign({}, orderData), { orderType: 'verification', serviceName: service.name, serviceDetails: {
                        verificationType: service.type
                    }, totalAmount: service.price, finalAmount: service.price, billingPeriod: 'one-time', endDate: getEndDate(orderDate, 'one-time') });
            }
            sampleOrders.push(orderData);
            orderCounter++;
        }
        // Add some recent high-value orders (January-February 2024)
        const recentHighValueOrders = 15;
        for (let i = 0; i < recentHighValueOrders; i++) {
            const orderDate = getRandomDateInMonth(2024, 1 + Math.floor(Math.random() * 2)); // Jan-Feb
            const user = users[Math.floor(Math.random() * users.length)];
            const plan = planServices.filter(p => p.planType === 'yearly')[Math.floor(Math.random() * 3)]; // Only yearly plans
            const orderData = {
                orderId: `ORD${orderCounter.toString().padStart(3, '0')}`,
                userId: user._id,
                orderType: 'plan',
                serviceName: plan.name,
                serviceDetails: {
                    planName: plan.planName,
                    planType: plan.planType,
                    features: plan.features
                },
                totalAmount: plan.price,
                finalAmount: plan.price,
                currency: 'INR',
                billingPeriod: plan.planType,
                paymentStatus: 'completed',
                paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
                transactionId: `TXN${orderCounter.toString().padStart(3, '0')}`,
                status: 'active',
                startDate: orderDate,
                endDate: getEndDate(orderDate, plan.planType),
                createdAt: orderDate,
                updatedAt: orderDate
            };
            sampleOrders.push(orderData);
            orderCounter++;
        }
        yield order_model_1.Order.insertMany(sampleOrders);
        // Calculate and display summary
        const totalOrders = yield order_model_1.Order.countDocuments();
        const completedOrders = yield order_model_1.Order.countDocuments({ paymentStatus: 'completed' });
        const pendingOrders = yield order_model_1.Order.countDocuments({ paymentStatus: 'pending' });
        const failedOrders = yield order_model_1.Order.countDocuments({ paymentStatus: 'failed' });
        const totalRevenue = yield order_model_1.Order.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$finalAmount' } } }
        ]);
        console.log('✅ 1 Year Sample Data Created Successfully');
        console.log(`📊 Total Orders: ${totalOrders}`);
        console.log(`✅ Completed Orders: ${completedOrders}`);
        console.log(`⏳ Pending Orders: ${pendingOrders}`);
        console.log(`❌ Failed Orders: ${failedOrders}`);
        console.log(`💰 Total Revenue: ₹${((_b = (_a = totalRevenue[0]) === null || _a === void 0 ? void 0 : _a.total) === null || _b === void 0 ? void 0 : _b.toLocaleString()) || 0}`);
        console.log(`📈 Success Rate: ${((completedOrders / totalOrders) * 100).toFixed(1)}%`);
        console.log(`📅 Data Period: March 2023 - February 2024`);
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding orders:', error);
        process.exit(1);
    }
});
seedOrders();

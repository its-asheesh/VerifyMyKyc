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
const auth_model_1 = require("./auth.model");
const db_1 = require("../../config/db");
const seedUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connectDB)();
        // Check if users already exist
        const existingUsers = yield auth_model_1.User.countDocuments();
        if (existingUsers > 0) {
            console.log('ℹ️ Users already exist, skipping seeding');
            process.exit(0);
        }
        const users = [
            {
                name: 'Admin User',
                email: 'admin@verifymykyc.com',
                password: 'admin123',
                role: 'admin',
                company: 'VerifyMyKyc',
                phone: '919876543210',
                emailVerified: true,
                isActive: true,
                createdAt: new Date('2023-01-15')
            },
            {
                name: 'Demo User',
                email: 'demo@example.com',
                password: 'password',
                role: 'user',
                company: 'Demo Company',
                phone: '919876543211',
                emailVerified: true,
                isActive: true,
                createdAt: new Date('2023-02-20')
            },
            {
                name: 'Rahul Sharma',
                email: 'rahul.sharma@techcorp.com',
                password: 'password123',
                role: 'user',
                company: 'TechCorp Solutions',
                phone: '919876543212',
                emailVerified: true,
                isActive: true,
                createdAt: new Date('2023-03-10')
            },
            {
                name: 'Priya Patel',
                email: 'priya.patel@fintech.com',
                password: 'password123',
                role: 'user',
                company: 'FinTech Innovations',
                phone: '919876543213',
                emailVerified: true,
                isActive: true,
                createdAt: new Date('2023-04-05')
            },
            {
                name: 'Amit Kumar',
                email: 'amit.kumar@startup.com',
                password: 'password123',
                role: 'user',
                company: 'Startup Ventures',
                phone: '919876543214',
                emailVerified: true,
                isActive: true,
                createdAt: new Date('2023-05-15')
            },
            {
                name: 'Neha Singh',
                email: 'neha.singh@consulting.com',
                password: 'password123',
                role: 'user',
                company: 'Consulting Partners',
                phone: '919876543215',
                emailVerified: true,
                isActive: true,
                createdAt: new Date('2023-06-20')
            },
            {
                name: 'Vikram Mehta',
                email: 'vikram.mehta@enterprise.com',
                password: 'password123',
                role: 'user',
                company: 'Enterprise Solutions',
                phone: '919876543216',
                emailVerified: true,
                isActive: true,
                createdAt: new Date('2023-07-12')
            },
            {
                name: 'Anjali Desai',
                email: 'anjali.desai@digital.com',
                password: 'password123',
                role: 'user',
                company: 'Digital Transform',
                phone: '919876543217',
                emailVerified: true,
                isActive: true,
                createdAt: new Date('2023-08-25')
            },
            {
                name: 'Suresh Reddy',
                email: 'suresh.reddy@banking.com',
                password: 'password123',
                role: 'user',
                company: 'Banking Solutions',
                phone: '919876543218',
                emailVerified: true,
                isActive: true,
                createdAt: new Date('2023-09-30')
            },
            {
                name: 'Kavita Verma',
                email: 'kavita.verma@insurance.com',
                password: 'password123',
                role: 'user',
                company: 'Insurance Corp',
                phone: '919876543219',
                emailVerified: true,
                isActive: true,
                createdAt: new Date('2023-10-15')
            },
            {
                name: 'Rajesh Gupta',
                email: 'rajesh.gupta@retail.com',
                password: 'password123',
                role: 'user',
                company: 'Retail Chain',
                phone: '919876543220',
                emailVerified: true,
                isActive: true,
                createdAt: new Date('2023-11-08')
            },
            {
                name: 'Meera Iyer',
                email: 'meera.iyer@healthcare.com',
                password: 'password123',
                role: 'user',
                company: 'Healthcare Systems',
                phone: '919876543221',
                emailVerified: true,
                isActive: true,
                createdAt: new Date('2023-12-03')
            },
            {
                name: 'Arjun Malhotra',
                email: 'arjun.malhotra@education.com',
                password: 'password123',
                role: 'user',
                company: 'Education Tech',
                phone: '919876543222',
                emailVerified: true,
                isActive: true,
                createdAt: new Date('2024-01-10')
            },
            {
                name: 'Pooja Sharma',
                email: 'pooja.sharma@logistics.com',
                password: 'password123',
                role: 'user',
                company: 'Logistics Pro',
                phone: '919876543223',
                emailVerified: true,
                isActive: true,
                createdAt: new Date('2024-01-25')
            },
            {
                name: 'Deepak Joshi',
                email: 'deepak.joshi@realestate.com',
                password: 'password123',
                role: 'user',
                company: 'Real Estate Group',
                phone: '919876543224',
                emailVerified: true,
                isActive: true,
                createdAt: new Date('2024-02-05')
            }
        ];
        yield auth_model_1.User.insertMany(users);
        console.log('✅ Users created successfully');
        console.log(`👥 Created ${users.length} users for analytics testing`);
        console.log('🔑 Admin credentials: admin@verifymykyc.com / admin123');
        console.log('👤 Demo credentials: demo@example.com / password');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding users:', error);
        process.exit(1);
    }
});
seedUsers();

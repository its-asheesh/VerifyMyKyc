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
exports.seedCarousel = void 0;
const carousel_model_1 = require("./carousel.model");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const carouselData = [
    {
        title: "Trusted Identity & Background Verification",
        subtitle: "for Your Home & Business",
        description: "Hiring domestic help or personal staff is convenient but ensuring their trustworthiness is crucial. VerifyMyKyc is a digital identity verification platform tailored for individuals and households.",
        imageUrl: "/carousel/slide1.jpg", // Local image path
        buttonText: "Start Verifying",
        buttonLink: "/custom-pricing",
        isActive: true,
        order: 1
    },
    {
        title: "Lightning Fast Document Verification",
        subtitle: "in Just 3 Seconds",
        description: "Experience the fastest KYC verification in India. Our advanced AI technology processes documents instantly while maintaining the highest security standards.",
        imageUrl: "/carousel/slide2.png", // Local image path
        buttonText: "Try Now",
        buttonLink: "/products",
        isActive: true,
        order: 2
    },
    {
        title: "Complete Compliance Solution",
        subtitle: "for Modern Businesses",
        description: "Stay compliant with regulatory requirements while providing seamless user experience. Our platform covers all major verification needs for businesses of any size.",
        imageUrl: "/carousel/slide3.webp", // Local image path
        buttonText: "Get Started",
        buttonLink: "/solutions",
        isActive: true,
        order: 3
    }
];
const seedCarousel = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Clear existing carousel slides to update with new content
        yield carousel_model_1.CarouselSlide.deleteMany({});
        console.log('🗑️ Cleared existing carousel slides');
        // Insert carousel data
        yield carousel_model_1.CarouselSlide.insertMany(carouselData);
        console.log('🎠 Carousel slides seeded successfully!');
        console.log(`📊 Created ${carouselData.length} carousel slides`);
    }
    catch (error) {
        console.error('❌ Error seeding carousel slides:', error);
    }
});
exports.seedCarousel = seedCarousel;
// Run seeding if this file is executed directly
if (require.main === module) {
    mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/verifymykyc')
        .then(() => {
        console.log('🔗 Connected to MongoDB');
        return (0, exports.seedCarousel)();
    })
        .then(() => {
        console.log('✅ Carousel seeding completed');
        process.exit(0);
    })
        .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
}

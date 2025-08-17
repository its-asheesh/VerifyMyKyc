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
exports.reorderCarouselSlides = exports.toggleCarouselSlideStatus = exports.deleteCarouselSlide = exports.updateCarouselSlide = exports.createCarouselSlide = exports.getCarouselSlideById = exports.getAllCarouselSlides = exports.getCarouselSlides = void 0;
const carousel_model_1 = require("./carousel.model");
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
// Get all carousel slides (public - for client)
exports.getCarouselSlides = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slides = yield carousel_model_1.CarouselSlide.find({ isActive: true })
        .sort({ order: 1, createdAt: -1 });
    res.json({
        success: true,
        data: { slides }
    });
}));
// Admin: Get all carousel slides (including inactive)
exports.getAllCarouselSlides = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slides = yield carousel_model_1.CarouselSlide.find()
        .sort({ order: 1, createdAt: -1 });
    res.json({
        success: true,
        data: { slides }
    });
}));
// Admin: Get carousel slide by ID
exports.getCarouselSlideById = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const slide = yield carousel_model_1.CarouselSlide.findById(id);
    if (!slide) {
        return res.status(404).json({ message: 'Carousel slide not found' });
    }
    res.json({
        success: true,
        data: { slide }
    });
}));
// Admin: Create new carousel slide
exports.createCarouselSlide = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, subtitle, description, imageUrl, buttonText, buttonLink, isActive, order } = req.body;
    const slide = yield carousel_model_1.CarouselSlide.create({
        title,
        subtitle,
        description,
        imageUrl,
        buttonText,
        buttonLink,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0
    });
    res.status(201).json({
        success: true,
        message: 'Carousel slide created successfully',
        data: { slide }
    });
}));
// Admin: Update carousel slide
exports.updateCarouselSlide = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = req.body;
    const slide = yield carousel_model_1.CarouselSlide.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!slide) {
        return res.status(404).json({ message: 'Carousel slide not found' });
    }
    res.json({
        success: true,
        message: 'Carousel slide updated successfully',
        data: { slide }
    });
}));
// Admin: Delete carousel slide
exports.deleteCarouselSlide = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const slide = yield carousel_model_1.CarouselSlide.findByIdAndDelete(id);
    if (!slide) {
        return res.status(404).json({ message: 'Carousel slide not found' });
    }
    res.json({
        success: true,
        message: 'Carousel slide deleted successfully'
    });
}));
// Admin: Toggle carousel slide status
exports.toggleCarouselSlideStatus = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const slide = yield carousel_model_1.CarouselSlide.findById(id);
    if (!slide) {
        return res.status(404).json({ message: 'Carousel slide not found' });
    }
    slide.isActive = !slide.isActive;
    yield slide.save();
    res.json({
        success: true,
        message: `Carousel slide ${slide.isActive ? 'activated' : 'deactivated'} successfully`,
        data: { slide }
    });
}));
// Admin: Reorder carousel slides
exports.reorderCarouselSlides = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slides } = req.body; // Array of { id, order }
    if (!Array.isArray(slides)) {
        return res.status(400).json({ message: 'Invalid slides data' });
    }
    // Update each slide's order
    for (const slideData of slides) {
        yield carousel_model_1.CarouselSlide.findByIdAndUpdate(slideData.id, { order: slideData.order });
    }
    res.json({
        success: true,
        message: 'Carousel slides reordered successfully'
    });
}));

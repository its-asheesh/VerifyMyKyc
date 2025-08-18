"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../common/middleware/auth");
const review_controller_1 = require("./review.controller");
const router = express_1.default.Router();
// Public: list approved reviews for a product
router.get('/product/:productId', review_controller_1.getProductReviews);
// Authenticated user: create a review
router.post('/', auth_1.authenticate, review_controller_1.createReview);
// Admin routes
router.use(auth_1.authenticate, auth_1.requireAdmin);
router.get('/', review_controller_1.adminListReviews);
router.put('/:id', review_controller_1.adminUpdateReview);
router.delete('/:id', review_controller_1.adminDeleteReview);
exports.default = router;

import { Router } from 'express';
import aadhaarRouter from './modules/aadhaar/aadhaar.router';
import panRouter from './modules/pan/pan.router';
import gstinRouter from './modules/gstin/gstin.router';
import mcaRouter from './modules/mca/mca.router';
import drivingLicenseRouter from './modules/drivinglicense/drivinglicense.router';
import echallanRouter from './modules/echallan/echallan.router';
import pricingRouter from './modules/pricing/pricing.router';
import authRouter from './modules/auth/auth.router';
import orderRouter from './modules/orders/order.router';
import analyticsRouter from './modules/analytics/analytics.router';
import carouselRouter from './modules/carousel/carousel.router';
import couponRouter from './modules/coupons/coupon.router';
import bankAccountRouter from './modules/bankaccount/bankaccount.router';
import voterRouter from './modules/voter/voter.router';
import reviewsRouter from './modules/reviews/review.router';
import vehicleRouter from './modules/vehicle/vehicle.router';
import passportRouter from './modules/passport/passport.routes';

const router = Router();

// Auth routes
router.use('/auth', authRouter);

// Order routes
router.use('/orders', orderRouter);

// Analytics routes
router.use('/analytics', analyticsRouter);

// Carousel routes
router.use('/carousel', carouselRouter);

// Coupon routes
router.use('/coupons', couponRouter);

// Other routes
router.use('/aadhaar', aadhaarRouter);
router.use('/pan', panRouter);
router.use('/gstin', gstinRouter);
router.use('/mca', mcaRouter);
router.use('/drivinglicense', drivingLicenseRouter);
router.use('/echallan', echallanRouter);
router.use('/pricing', pricingRouter);
router.use('/bankaccount', bankAccountRouter);
router.use('/voter', voterRouter);
router.use('/reviews', reviewsRouter);
router.use('/vehicle', vehicleRouter)
// Passport routes

router.use('/passport', passportRouter);

export default router;

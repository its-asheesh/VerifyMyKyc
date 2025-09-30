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
import ccrvRouter from './modules/ccrv/ccrv.routes';
import subscriberRouter from './modules/subscriber/subscriber.routes';
import blogRouter from './modules/blog/blog.router';
import epfoRouter from './modules/epfo/epfo.router';

import callbackRouter from "./common/middleware/callback-handler";
const router = Router();

// Callback handler route
router.use(callbackRouter);

// Auth routes - should come first for authentication
router.use('/auth', authRouter);

// Passport routes - make sure this is properly registered
router.use('/passport', passportRouter);

// Other routes in logical order
router.use('/vehicle', vehicleRouter);
router.use('/aadhaar', aadhaarRouter);
router.use('/ccrv', ccrvRouter);
router.use('/pan', panRouter);
router.use('/gstin', gstinRouter);
router.use('/epfo', epfoRouter);
router.use('/mca', mcaRouter);
router.use('/drivinglicense', drivingLicenseRouter);
router.use('/echallan', echallanRouter);
router.use('/pricing', pricingRouter);
router.use('/bankaccount', bankAccountRouter);
router.use('/voter', voterRouter);
router.use('/reviews', reviewsRouter);
router.use('/orders', orderRouter);
router.use('/analytics', analyticsRouter);
router.use('/carousel', carouselRouter);
router.use('/coupons', couponRouter);
router.use('/blog', blogRouter);

// Subscriber routes
router.use('/subscribers', subscriberRouter);

export default router;
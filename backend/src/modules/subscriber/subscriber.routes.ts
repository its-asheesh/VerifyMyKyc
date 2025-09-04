import { Router } from 'express';
import * as subscriberController from './subscriber.controller';
import { authenticate, requireAdmin } from '../../common/middleware/auth';

const router = Router();

// Public route for subscribing
router.post('/', subscriberController.subscribe);

// Protected admin routes
router.get('/', authenticate, requireAdmin, subscriberController.getAllSubscribers);
router.delete('/:id', authenticate, requireAdmin, subscriberController.deleteSubscriber);
router.get('/export', authenticate, requireAdmin, subscriberController.exportSubscribers);

export default router;

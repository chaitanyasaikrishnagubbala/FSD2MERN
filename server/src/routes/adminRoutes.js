import express from 'express';
import {
  getDashboardStats,
  getAllBookings,
  updateBookingStatus,
  getAllUsers
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validate.js';

const router = express.Router();

// Restrict all admin routes to authenticated admin users
router.use(authenticate, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/status', validateObjectId('id'), updateBookingStatus);
router.get('/users', getAllUsers);

export default router;

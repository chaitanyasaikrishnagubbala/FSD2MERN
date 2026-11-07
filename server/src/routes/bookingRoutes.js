import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking
} from '../controllers/bookingController.js';
import { authenticate } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validate.js';

const router = express.Router();

// All booking routes require authentication
router.use(authenticate);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/:id', validateObjectId('id'), getBookingById);
router.patch('/:id/cancel', validateObjectId('id'), cancelBooking);

export default router;

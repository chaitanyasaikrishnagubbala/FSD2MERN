import express from 'express';
import {
  getVehicles,
  getVehicleById,
  checkAvailability,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from '../controllers/vehicleController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validate.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Optional user extractor for public listing (so admin can view inactive if ?all=true)
const optionalUser = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'driveease_jwt_secret_dev_key_2026');
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (user) req.user = user;
    }
  } catch (err) {
    // Silently continue for public routes
  }
  next();
};

// Public endpoints
router.get('/', optionalUser, getVehicles);
router.get('/:id', validateObjectId('id'), getVehicleById);
router.get('/:id/availability', validateObjectId('id'), checkAvailability);

// Admin-only endpoints
router.post('/', authenticate, authorize('admin'), createVehicle);
router.put('/:id', authenticate, authorize('admin'), validateObjectId('id'), updateVehicle);
router.delete('/:id', authenticate, authorize('admin'), validateObjectId('id'), deleteVehicle);

export default router;

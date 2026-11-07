import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';
import { createBookingWithLock, isValidStatusTransition } from '../services/bookingService.js';

/**
 * Place a new booking.
 * POST /api/bookings
 */
export const createBooking = async (req, res, next) => {
  try {
    const { vehicleId, pickupDate, returnDate } = req.body;

    if (!vehicleId || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: 'vehicleId, pickupDate, and returnDate are all required'
      });
    }

    const booking = await createBookingWithLock({
      userId: req.user._id,
      vehicleId,
      pickupDateInput: pickupDate,
      returnDateInput: returnDate
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('vehicle', 'make model year category pricePerDay images registrationNumber location')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully and is awaiting confirmation',
      booking: populatedBooking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get all personal bookings for the logged-in customer.
 * GET /api/bookings/my
 */
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('vehicle', 'make model year category pricePerDay images location registrationNumber')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single booking by ID.
 * Access restricted to booking owner or administrator.
 * GET /api/bookings/:id
 */
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('vehicle', 'make model year category pricePerDay images location registrationNumber')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check ownership or admin status
    const isOwner = booking.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not authorized to view this booking.'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel an eligible booking by customer or admin.
 * PATCH /api/bookings/:id/cancel
 */
export const cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const isOwner = booking.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You cannot cancel another user\'s booking.'
      });
    }

    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a booking with status '${booking.status}'`
      });
    }

    // If customer is cancelling, ensure rental hasn't already started
    if (!isAdmin && new Date(booking.pickupDate) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Bookings cannot be cancelled once the rental start date has arrived'
      });
    }

    booking.status = 'CANCELLED';
    if (reason) {
      booking.cancellationReason = reason.trim();
    }
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

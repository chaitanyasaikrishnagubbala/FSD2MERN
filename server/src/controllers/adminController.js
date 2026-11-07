import Vehicle from '../models/Vehicle.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { checkVehicleAvailability, isValidStatusTransition } from '../services/bookingService.js';

/**
 * Get overall dashboard analytics and metrics for Admin.
 * GET /api/admin/dashboard
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalVehicles,
      activeVehicles,
      totalCustomers,
      activeBookingsCount,
      pendingBookingsCount,
      completedBookingsCount,
      revenueAggregation,
      recentBookings
    ] = await Promise.all([
      Vehicle.countDocuments(),
      Vehicle.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'customer' }),
      Booking.countDocuments({ status: { $in: ['PENDING', 'CONFIRMED'] } }),
      Booking.countDocuments({ status: 'PENDING' }),
      Booking.countDocuments({ status: 'COMPLETED' }),
      Booking.aggregate([
        { $match: { status: 'COMPLETED' } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
      ]),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('vehicle', 'make model year images')
        .populate('user', 'name email phone')
        .lean()
    ]);

    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalVehicles,
        activeVehicles,
        totalCustomers,
        activeBookingsCount,
        pendingBookingsCount,
        completedBookingsCount,
        totalRevenue
      },
      recentBookings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all customer bookings with pagination and filters.
 * GET /api/admin/bookings
 */
export const getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 15 } = req.query;

    const query = {};
    if (status && status !== 'ALL') {
      query.status = status;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('vehicle', 'make model year category pricePerDay images registrationNumber')
        .populate('user', 'name email phone')
        .lean(),
      Booking.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a booking's status (Admin only).
 * PATCH /api/admin/bookings/:id/status
 */
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const allowedStatuses = ['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status: '${status}'. Allowed values: ${allowedStatuses.join(', ')}`
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify valid status transition
    if (booking.status === status) {
      return res.status(200).json({
        success: true,
        message: `Booking is already in status '${status}'`,
        booking
      });
    }

    if (!isValidStatusTransition(booking.status, status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition: cannot change booking status from '${booking.status}' to '${status}'`
      });
    }

    // If confirming a pending booking, ensure no other booking claimed the dates in the meantime
    if (status === 'CONFIRMED') {
      const { isAvailable } = await checkVehicleAvailability(
        booking.vehicle,
        booking.pickupDate,
        booking.returnDate,
        booking._id
      );

      if (!isAvailable) {
        return res.status(409).json({
          success: false,
          message: 'Cannot confirm booking: Another confirmed or pending reservation overlaps with these dates'
        });
      }
    }

    booking.status = status;
    if (reason) {
      booking.cancellationReason = reason.trim();
    }
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate('vehicle', 'make model year category pricePerDay images registrationNumber')
      .populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      message: `Booking status successfully updated to ${status}`,
      booking: populated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all registered users and their booking summaries.
 * GET /api/admin/users
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 }).lean();

    // Attach booking counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const bookingsCount = await Booking.countDocuments({ user: u._id });
        return {
          ...u,
          bookingsCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithStats.length,
      users: usersWithStats
    });
  } catch (error) {
    next(error);
  }
};

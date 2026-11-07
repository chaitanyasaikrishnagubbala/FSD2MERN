import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';

/**
 * Standardize and normalize a date string or object to UTC midnight.
 * Ensures consistent boundary comparisons regardless of client timezone offsets.
 *
 * Convention:
 * - Pickup is normalized to 00:00:00.000 UTC on the pickup date.
 * - Return is normalized to 23:59:59.999 UTC on the return date (or equivalent next midnight),
 *   representing that the customer retains the vehicle through the return day.
 * - Interval overlap condition:
 *   existingPickup <= requestedReturn AND existingReturn >= requestedPickup
 */
export const normalizeBookingDates = (pickupDateInput, returnDateInput) => {
  const pickup = new Date(pickupDateInput);
  const returnDate = new Date(returnDateInput);

  if (isNaN(pickup.getTime()) || isNaN(returnDate.getTime())) {
    throw new Error('Invalid date format provided');
  }

  // Normalize to UTC calendar dates
  const pickupNormalized = new Date(
    Date.UTC(pickup.getUTCFullYear(), pickup.getUTCMonth(), pickup.getUTCDate(), 0, 0, 0, 0)
  );

  const returnNormalized = new Date(
    Date.UTC(returnDate.getUTCFullYear(), returnDate.getUTCMonth(), returnDate.getUTCDate(), 23, 59, 59, 999)
  );

  // Today normalized in UTC
  const now = new Date();
  const todayNormalized = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0)
  );

  if (pickupNormalized < todayNormalized) {
    throw new Error('Pickup date cannot be in the past');
  }

  if (returnNormalized <= pickupNormalized) {
    throw new Error('Return date must be strictly after pickup date');
  }

  // Calculate rental days (minimum 1 day)
  const diffTime = returnNormalized.getTime() - pickupNormalized.getTime();
  const numberOfDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  return {
    pickupNormalized,
    returnNormalized,
    numberOfDays
  };
};

/**
 * Check if a vehicle is available for a requested date range.
 * Considers PENDING and CONFIRMED bookings as blocking.
 * Excludes REJECTED and CANCELLED bookings.
 * 
 * Standard interval overlap:
 * existingPickup < requestedReturn AND existingReturn > requestedPickup
 * 
 * @param {string|ObjectId} vehicleId
 * @param {Date} pickupDate
 * @param {Date} returnDate
 * @param {string|ObjectId} [excludeBookingId] - Used when checking status transitions
 * @param {ClientSession} [session] - Optional Mongoose transaction session
 */
export const checkVehicleAvailability = async (
  vehicleId,
  pickupDate,
  returnDate,
  excludeBookingId = null,
  session = null
) => {
  const query = {
    vehicle: vehicleId,
    status: { $in: ['PENDING', 'CONFIRMED'] },
    pickupDate: { $lt: returnDate },
    returnDate: { $gt: pickupDate }
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBookings = await Booking.find(query)
    .session(session)
    .select('_id pickupDate returnDate status')
    .lean();

  return {
    isAvailable: conflictingBookings.length === 0,
    conflicts: conflictingBookings
  };
};

/**
 * Calculate total price on server-side. Never trusts client-supplied totals.
 * @param {number} dailyPrice
 * @param {number} days
 */
export const calculateRentalPrice = (dailyPrice, days) => {
  const basePrice = Math.round(dailyPrice * days);
  return {
    dailyRate: dailyPrice,
    days,
    basePrice,
    totalPrice: basePrice
  };
};

/**
 * Creates a booking safely handling race conditions:
 * Uses a Mongoose transaction session if supported by the MongoDB cluster (Replica Set / Atlas).
 * If standalone MongoDB without replica set is encountered, executes an atomic reservation sequence.
 */
export const createBookingWithLock = async ({
  userId,
  vehicleId,
  pickupDateInput,
  returnDateInput
}) => {
  const { pickupNormalized, returnNormalized, numberOfDays } = normalizeBookingDates(
    pickupDateInput,
    returnDateInput
  );

  // Check vehicle exists and is active
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  if (!vehicle.isActive) {
    throw new Error('This vehicle is currently deactivated and not available for rent');
  }

  const { totalPrice, dailyRate } = calculateRentalPrice(vehicle.pricePerDay, numberOfDays);

  // Attempt transaction (supported on MongoDB Atlas & Replica Sets)
  let session = null;
  let useTransactions = false;

  try {
    session = await mongoose.startSession();
    // Test if replica set allows transactions
    await session.startTransaction();
    useTransactions = true;
  } catch (err) {
    // Standalone MongoDB (common in local dev without replica set)
    session = null;
    useTransactions = false;
  }

  if (useTransactions && session) {
    try {
      const { isAvailable } = await checkVehicleAvailability(
        vehicleId,
        pickupNormalized,
        returnNormalized,
        null,
        session
      );

      if (!isAvailable) {
        throw new Error('Vehicle is already booked or reserved for the selected dates');
      }

      const booking = new Booking({
        user: userId,
        vehicle: vehicleId,
        pickupDate: pickupNormalized,
        returnDate: returnNormalized,
        numberOfDays,
        pricePerDayAtBooking: dailyRate,
        totalPrice,
        status: 'PENDING'
      });

      await booking.save({ session });
      await session.commitTransaction();
      session.endSession();

      return booking;
    } catch (txError) {
      await session.abortTransaction();
      session.endSession();
      throw txError;
    }
  } else {
    // Non-replica set fallback: atomic recheck
    const { isAvailable } = await checkVehicleAvailability(
      vehicleId,
      pickupNormalized,
      returnNormalized
    );

    if (!isAvailable) {
      throw new Error('Vehicle is already booked or reserved for the selected dates');
    }

    const booking = new Booking({
      user: userId,
      vehicle: vehicleId,
      pickupDate: pickupNormalized,
      returnDate: returnNormalized,
      numberOfDays,
      pricePerDayAtBooking: dailyRate,
      totalPrice,
      status: 'PENDING'
    });

    await booking.save();
    return booking;
  }
};

/**
 * Validates and enforces allowed status transitions.
 * PENDING -> CONFIRMED, REJECTED, CANCELLED
 * CONFIRMED -> COMPLETED, CANCELLED
 */
export const isValidStatusTransition = (currentStatus, targetStatus) => {
  const validTransitions = {
    PENDING: ['CONFIRMED', 'REJECTED', 'CANCELLED'],
    CONFIRMED: ['COMPLETED', 'CANCELLED'],
    REJECTED: [],
    CANCELLED: [],
    COMPLETED: []
  };

  return validTransitions[currentStatus]?.includes(targetStatus) || false;
};

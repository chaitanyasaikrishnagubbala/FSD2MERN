import Vehicle from '../models/Vehicle.js';
import Booking from '../models/Booking.js';
import {
  normalizeBookingDates,
  checkVehicleAvailability,
  calculateRentalPrice
} from '../services/bookingService.js';

/**
 * Get all vehicles with filtering, search, sorting, and pagination.
 * GET /api/vehicles
 */
export const getVehicles = async (req, res, next) => {
  try {
    const {
      search,
      category,
      fuelType,
      transmission,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
      sort = 'createdAt_desc',
      all = 'false'
    } = req.query;

    const query = {};

    // By default, public listing only returns active vehicles
    // If admin explicitly asks for all, check req.user
    if (all === 'true' && req.user && req.user.role === 'admin') {
      // Don't filter isActive
    } else {
      query.isActive = true;
    }

    if (category) {
      query.category = category;
    }

    if (fuelType) {
      query.fuelType = fuelType;
    }

    if (transmission) {
      query.transmission = transmission;
    }

    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    if (search) {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { make: { $regex: sanitized, $options: 'i' } },
        { model: { $regex: sanitized, $options: 'i' } },
        { location: { $regex: sanitized, $options: 'i' } }
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { pricePerDay: 1 };
    else if (sort === 'price_desc') sortOption = { pricePerDay: -1 };
    else if (sort === 'year_desc') sortOption = { year: -1 };
    else if (sort === 'name_asc') sortOption = { make: 1, model: 1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [vehicles, total] = await Promise.all([
      Vehicle.find(query).sort(sortOption).skip(skip).limit(limitNum).lean(),
      Vehicle.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: vehicles.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      vehicles
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single vehicle by ID.
 * GET /api/vehicles/:id
 */
export const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.status(200).json({
      success: true,
      vehicle
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check availability and calculate price for requested dates.
 * GET /api/vehicles/:id/availability?pickupDate=...&returnDate=...
 */
export const checkAvailability = async (req, res, next) => {
  try {
    const { pickupDate, returnDate } = req.query;

    if (!pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: 'Both pickupDate and returnDate query parameters are required'
      });
    }

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    if (!vehicle.isActive) {
      return res.status(200).json({
        success: true,
        isAvailable: false,
        message: 'Vehicle is currently deactivated'
      });
    }

    const { pickupNormalized, returnNormalized, numberOfDays } = normalizeBookingDates(
      pickupDate,
      returnDate
    );

    const { isAvailable, conflicts } = await checkVehicleAvailability(
      vehicle._id,
      pickupNormalized,
      returnNormalized
    );

    const pricing = calculateRentalPrice(vehicle.pricePerDay, numberOfDays);

    res.status(200).json({
      success: true,
      vehicleId: vehicle._id,
      pickupDate: pickupNormalized,
      returnDate: returnNormalized,
      numberOfDays,
      isAvailable,
      conflictsCount: conflicts.length,
      pricing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Create a new vehicle (Admin only).
 * POST /api/vehicles
 */
export const createVehicle = async (req, res, next) => {
  try {
    const {
      make,
      model,
      year,
      category,
      description,
      images,
      pricePerDay,
      fuelType,
      transmission,
      seats,
      registrationNumber,
      location,
      isActive
    } = req.body;

    const existingReg = await Vehicle.findOne({
      registrationNumber: registrationNumber?.toUpperCase().trim()
    });

    if (existingReg) {
      return res.status(409).json({
        success: false,
        message: `A vehicle with registration number '${registrationNumber}' already exists`
      });
    }

    const vehicle = await Vehicle.create({
      make,
      model,
      year,
      category,
      description,
      images: Array.isArray(images) && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
      ],
      pricePerDay,
      fuelType,
      transmission,
      seats,
      registrationNumber: registrationNumber.toUpperCase().trim(),
      location,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      vehicle
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a vehicle (Admin only).
 * PUT /api/vehicles/:id
 */
export const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    if (req.body.registrationNumber) {
      const regUpper = req.body.registrationNumber.toUpperCase().trim();
      const conflict = await Vehicle.findOne({
        registrationNumber: regUpper,
        _id: { $ne: vehicle._id }
      });
      if (conflict) {
        return res.status(409).json({
          success: false,
          message: `Registration number '${regUpper}' is already assigned to another vehicle`
        });
      }
      req.body.registrationNumber = regUpper;
    }

    Object.assign(vehicle, req.body);
    await vehicle.save();

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      vehicle
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete or deactivate vehicle (Admin only).
 * DELETE /api/vehicles/:id
 */
export const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Check if vehicle has active or upcoming bookings
    const activeBookings = await Booking.countDocuments({
      vehicle: vehicle._id,
      status: { $in: ['PENDING', 'CONFIRMED'] }
    });

    if (activeBookings > 0) {
      // Safely deactivate instead of hard delete to preserve referential integrity
      vehicle.isActive = false;
      await vehicle.save();

      return res.status(200).json({
        success: true,
        message: `Vehicle has ${activeBookings} active booking(s). It has been deactivated instead of permanently deleted to preserve rental history.`,
        deactivated: true
      });
    }

    await vehicle.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

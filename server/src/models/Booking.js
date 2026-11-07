import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle reference is required'],
      index: true
    },
    pickupDate: {
      type: Date,
      required: [true, 'Pickup date is required']
    },
    returnDate: {
      type: Date,
      required: [true, 'Return date is required']
    },
    numberOfDays: {
      type: Number,
      required: [true, 'Number of rental days is required'],
      min: [1, 'Rental duration must be at least 1 day']
    },
    pricePerDayAtBooking: {
      type: Number,
      required: [true, 'Daily rate at booking is required'],
      min: [0, 'Daily rate cannot be negative']
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative']
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED'],
        message: '{VALUE} is not a valid booking status'
      },
      default: 'PENDING',
      index: true
    },
    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 300
    }
  },
  {
    timestamps: true
  }
);

// Compound index to accelerate date overlap queries on specific vehicles
bookingSchema.index({ vehicle: 1, status: 1, pickupDate: 1, returnDate: 1 });

bookingSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;

import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: [true, 'Vehicle make is required'],
      trim: true,
      maxlength: [50, 'Make cannot exceed 50 characters']
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true,
      maxlength: [50, 'Model cannot exceed 50 characters']
    },
    year: {
      type: Number,
      required: [true, 'Manufacturing year is required'],
      min: [2000, 'Year must be 2000 or later'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the far future']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Hatchback', 'Sedan', 'SUV', 'Motorcycle', 'Luxury'],
        message: '{VALUE} is not a valid vehicle category'
      }
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one vehicle image URL is required'
      }
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Daily rental price is required'],
      min: [100, 'Daily price must be at least ₹100']
    },
    fuelType: {
      type: String,
      required: [true, 'Fuel type is required'],
      enum: {
        values: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
        message: '{VALUE} is not a valid fuel type'
      }
    },
    transmission: {
      type: String,
      required: [true, 'Transmission type is required'],
      enum: {
        values: ['Manual', 'Automatic'],
        message: '{VALUE} is not a valid transmission'
      }
    },
    seats: {
      type: Number,
      required: [true, 'Seating capacity is required'],
      min: [1, 'Seats must be at least 1'],
      max: [15, 'Seats cannot exceed 15']
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9 -]{5,20}$/, 'Invalid registration number format']
    },
    location: {
      type: String,
      required: [true, 'Vehicle location is required'],
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Indexing for search and filtering
vehicleSchema.index({ category: 1, isActive: 1, pricePerDay: 1 });
vehicleSchema.index({ make: 'text', model: 'text', location: 'text' });

vehicleSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;

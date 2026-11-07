import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Vehicle from '../src/models/Vehicle.js';
import Booking from '../src/models/Booking.js';
import { connectDB } from '../src/config/db.js';

dotenv.config();

const sampleVehicles = [
  {
    make: 'Maruti Suzuki',
    model: 'Swift ZXi',
    year: 2024,
    category: 'Hatchback',
    description: 'India\'s most beloved premium hatchback. Exceptional fuel efficiency, peppy 1.2L DualJet engine, responsive steering, and effortless city maneuverability.',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
    ],
    pricePerDay: 1499,
    fuelType: 'Petrol',
    transmission: 'Manual',
    seats: 5,
    registrationNumber: 'KA-01-MJ-1234',
    location: 'Bangalore Central, MG Road',
    isActive: true
  },
  {
    make: 'Hyundai',
    model: 'i20 Asta (O)',
    year: 2023,
    category: 'Hatchback',
    description: 'Feature-loaded hatchback with electric sunroof, 10.25-inch infotainment, Bose audio system, and refined automatic transmission for urban cruising.',
    images: [
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'
    ],
    pricePerDay: 1799,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    registrationNumber: 'MH-02-CK-5678',
    location: 'Mumbai Airport Terminal 2',
    isActive: true
  },
  {
    make: 'Tata',
    model: 'Nexon Fearless+ S',
    year: 2024,
    category: 'SUV',
    description: '5-star GNCAP safety rated compact SUV. High ground clearance, bold futuristic stance, ventilated front seats, and robust performance on rough terrains.',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
    ],
    pricePerDay: 2399,
    fuelType: 'Diesel',
    transmission: 'Manual',
    seats: 5,
    registrationNumber: 'KA-03-NX-9012',
    location: 'Bangalore Indiranagar',
    isActive: true
  },
  {
    make: 'Hyundai',
    model: 'Creta SX (O)',
    year: 2024,
    category: 'SUV',
    description: 'The benchmark mid-size SUV. Equipped with panoramic sunroof, Level 2 ADAS suite, dual-zone climate control, and supreme ride comfort for long family road trips.',
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80'
    ],
    pricePerDay: 2899,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seats: 5,
    registrationNumber: 'DL-04-CR-3456',
    location: 'Delhi NCR Aerocity',
    isActive: true
  },
  {
    make: 'Mahindra',
    model: 'Thar LX 4x4 Hard Top',
    year: 2023,
    category: 'SUV',
    description: 'Iconic authentic 4x4 off-roader. Shift-on-the-fly 4WD transfer case, rugged chassis, commanding view of the road, and adventure-ready capabilities.',
    images: [
      'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'
    ],
    pricePerDay: 3499,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seats: 4,
    registrationNumber: 'MH-12-TH-7890',
    location: 'Pune Hinjewadi IT Park',
    isActive: true
  },
  {
    make: 'Honda',
    model: 'City ZX e:HEV',
    year: 2024,
    category: 'Sedan',
    description: 'Executive sedan par excellence. Plush leather upholstery, supreme rear seat legroom, ultra-smooth CVT transmission, and legendary Honda i-VTEC reliability.',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80'
    ],
    pricePerDay: 2699,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    seats: 5,
    registrationNumber: 'KA-05-CT-2345',
    location: 'Bangalore Koramangala',
    isActive: true
  },
  {
    make: 'Royal Enfield',
    model: 'Classic 350 Chrome',
    year: 2023,
    category: 'Motorcycle',
    description: 'Timeless retro cruiser with signature single-cylinder thump, dual-channel ABS, comfortable touring posture, and vintage chrome aesthetic.',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80'
    ],
    pricePerDay: 999,
    fuelType: 'Petrol',
    transmission: 'Manual',
    seats: 2,
    registrationNumber: 'DL-08-RE-6789',
    location: 'Delhi Connaught Place',
    isActive: true
  },
  {
    make: 'KTM',
    model: 'Duke 200 BS6',
    year: 2024,
    category: 'Motorcycle',
    description: 'Lightweight high-revving streetfighter. WP Apex suspension, sharp trellis frame, aggressive predator styling, and thrilling cornering precision.',
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'
    ],
    pricePerDay: 1199,
    fuelType: 'Petrol',
    transmission: 'Manual',
    seats: 2,
    registrationNumber: 'MH-03-KD-1122',
    location: 'Mumbai Bandra West',
    isActive: true
  },
  {
    make: 'BMW',
    model: '3 Series Gran Limousine',
    year: 2024,
    category: 'Luxury',
    description: 'Ultimate driving machine combined with stretched wheelbase luxury. Vernasca leather, Harman Kardon 16-speaker surround sound, and twin-turbo performance.',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80'
    ],
    pricePerDay: 7999,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    registrationNumber: 'KA-01-BM-9999',
    location: 'Bangalore Whitefield',
    isActive: true
  }
];

export const seedDatabase = async () => {
  console.log('--- DriveEase Database Seeding Started ---');

  await connectDB();

  // 1. Seed or Verify Administrator Account
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@driveease.com').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@SecureDrive2026!';
  const adminName = process.env.ADMIN_NAME || 'DriveEase Administrator';
  const adminPhone = process.env.ADMIN_PHONE || '+91 9876543210';

  let adminUser = await User.findOne({ email: adminEmail });
  if (!adminUser) {
    const passwordHash = await User.hashPassword(adminPassword);
    adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      passwordHash,
      role: 'admin'
    });
    console.log(`[Seed] Created Administrator: ${adminEmail}`);
  } else {
    console.log(`[Seed] Administrator already exists: ${adminEmail}`);
  }

  // 2. Seed or Verify Sample Customer Account
  const customerEmail = (process.env.CUSTOMER_EMAIL || 'customer@driveease.com').toLowerCase().trim();
  const customerPassword = process.env.CUSTOMER_PASSWORD || 'Customer@12345!';
  const customerName = 'Rahul Sharma';
  const customerPhone = '+91 9123456780';

  let customerUser = await User.findOne({ email: customerEmail });
  if (!customerUser) {
    const passwordHash = await User.hashPassword(customerPassword);
    customerUser = await User.create({
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      passwordHash,
      role: 'customer'
    });
    console.log(`[Seed] Created Customer: ${customerEmail}`);
  } else {
    console.log(`[Seed] Customer already exists: ${customerEmail}`);
  }

  // 3. Seed Vehicles (Idempotent upsert by registration number)
  const seededVehicles = [];
  for (const veh of sampleVehicles) {
    const existing = await Vehicle.findOne({ registrationNumber: veh.registrationNumber });
    if (!existing) {
      const created = await Vehicle.create(veh);
      seededVehicles.push(created);
      console.log(`[Seed] Added Vehicle: ${veh.make} ${veh.model} [${veh.registrationNumber}]`);
    } else {
      seededVehicles.push(existing);
      console.log(`[Seed] Vehicle exists: ${veh.make} ${veh.model} [${veh.registrationNumber}]`);
    }
  }

  // 4. Seed Sample Bookings (Idempotent)
  const existingBookingsCount = await Booking.countDocuments();
  if (existingBookingsCount === 0 && customerUser && seededVehicles.length > 0) {
    const now = new Date();

    // Past completed booking (5 days ago)
    const pastPickup = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 5, 0, 0, 0));
    const pastReturn = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 2, 23, 59, 59));
    const pastVehicle = seededVehicles[0]; // Swift

    await Booking.create({
      user: customerUser._id,
      vehicle: pastVehicle._id,
      pickupDate: pastPickup,
      returnDate: pastReturn,
      numberOfDays: 3,
      pricePerDayAtBooking: pastVehicle.pricePerDay,
      totalPrice: pastVehicle.pricePerDay * 3,
      status: 'COMPLETED'
    });

    // Upcoming confirmed booking (starting 3 days from now)
    const futurePickup = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 3, 0, 0, 0));
    const futureReturn = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 6, 23, 59, 59));
    const futureVehicle = seededVehicles[3]; // Creta

    await Booking.create({
      user: customerUser._id,
      vehicle: futureVehicle._id,
      pickupDate: futurePickup,
      returnDate: futureReturn,
      numberOfDays: 3,
      pricePerDayAtBooking: futureVehicle.pricePerDay,
      totalPrice: futureVehicle.pricePerDay * 3,
      status: 'CONFIRMED'
    });

    console.log('[Seed] Created sample completed and upcoming bookings for demonstration');
  }

  console.log('--- DriveEase Database Seeding Completed Successfully ---');
  if (process.env.RUN_STANDALONE === 'true') {
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Check if executed directly from CLI: `node scripts/seed.js`
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  process.env.RUN_STANDALONE = 'true';
  seedDatabase().catch((err) => {
    console.error('[Seed Error]:', err);
    process.exit(1);
  });
}

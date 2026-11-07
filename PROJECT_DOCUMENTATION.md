# DriveEase — Vehicle Rental Management System
## Comprehensive Technical Documentation, Source Code Implementation & Academic Project Report

---

### Project Metadata
| Attribute | Details |
| :--- | :--- |
| **Project Title** | DriveEase — Enterprise Vehicle Rental Management System |
| **Academic Domain** | Full-Stack Web Development (FSD-2), Distributed Web Systems |
| **Architecture** | Three-Tier MERN Stack (MongoDB, Express.js, React.js, Node.js) |
| **Frontend Tooling** | React 18.3.1, Vite 6.0.3, Tailwind CSS 3.4.16, React Router DOM 6.28.0 |
| **Backend Framework** | Node.js (ES Modules, v22+), Express.js 5.3.0 |
| **Database & ODM** | MongoDB Atlas (Cloud Replica Set) with Mongoose ODM 9.11.4 |
| **Authentication** | Stateless JSON Web Tokens (JWT) & Salted bcrypt Hashes (10 rounds) |
| **Testing Suite** | Node.js Native Test Runner (`node:test`, `node:assert`), Supertest 7.3.1 |
| **Deployment Targets** | Backend Web Service on Render, Frontend SPA on Vercel, DB on MongoDB Atlas |
| **Author / Team** | DriveEase Development Team |
| **License** | ISC License |

---

## Table of Contents
1. [Executive Summary & Abstract](#1-executive-summary--abstract)
2. [System Requirements & Technology Stack](#2-system-requirements--technology-stack)
3. [System Architecture & High-Level Design](#3-system-architecture--high-level-design)
4. [Database Architecture & Actual Schema Code](#4-database-architecture--actual-schema-code)
   - 4.1 User Model & Password Hashing (`server/src/models/User.js`)
   - 4.2 Vehicle Model & Compound Indexing (`server/src/models/Vehicle.js`)
   - 4.3 Booking Model & Relationship References (`server/src/models/Booking.js`)
5. [Core Business Logic & Mathematical Algorithms](#5-core-business-logic--mathematical-algorithms)
   - 5.1 Standardized Date Normalization (`server/src/services/bookingService.js`)
   - 5.2 Mathematical Interval Overlap Engine (`checkVehicleAvailability`)
   - 5.3 Server-Authoritative Pricing Calculation (`calculateRentalPrice`)
   - 5.4 Transactional Concurrency Locking (`createBookingWithLock`)
   - 5.5 State Machine Lifecycle Transition Logic (`isValidStatusTransition`)
6. [Backend Infrastructure & Middleware Implementation](#6-backend-infrastructure--middleware-implementation)
   - 6.1 Server Bootstrap & Graceful Shutdown (`server/src/server.js`)
   - 6.2 Express Application Setup, CORS & Security Headers (`server/src/app.js`)
   - 6.3 Database Connection & Health Verification (`server/src/config/db.js`)
   - 6.4 JWT Authentication & Role Authorization Guard (`server/src/middleware/auth.js`)
   - 6.5 Centralized Error & 404 Handlers (`server/src/middleware/errorHandler.js`)
   - 6.6 Input Validation Middleware (`server/src/middleware/validate.js`)
7. [RESTful API Endpoints & Controller Code](#7-restful-api-endpoints--controller-code)
   - 7.1 Authentication Module (`server/src/routes/authRoutes.js` & `authController.js`)
   - 7.2 Vehicle Fleet Management (`server/src/routes/vehicleRoutes.js` & `vehicleController.js`)
   - 7.3 Booking & Reservation Controller (`server/src/routes/bookingRoutes.js` & `bookingController.js`)
   - 7.4 Administration Analytics & State Transitions (`server/src/routes/adminRoutes.js` & `adminController.js`)
8. [Frontend Architecture & Component Implementation](#8-frontend-architecture--component-implementation)
   - 8.1 React DOM Entry Point (`client/src/main.jsx`)
   - 8.2 Application Router & Layout Wrapper (`client/src/App.jsx`)
   - 8.3 Global State Management: AuthContext (`client/src/context/AuthContext.jsx`)
   - 8.4 Axios HTTP Client & JWT Interceptors (`client/src/services/api.js`)
   - 8.5 Protected Route Guards (`ProtectedRoute.jsx` & `AdminRoute.jsx`)
   - 8.6 Reusable UI Components (`VehicleCard.jsx` & `StatusBadge.jsx`)
   - 8.7 Vehicle Detail, Live Availability & Booking Flow (`client/src/pages/VehicleDetailPage.jsx`)
   - 8.8 Login Form with 1-Click Lab Demo Autofill (`client/src/pages/LoginPage.jsx`)
9. [Automated Verification & Test Suite Implementation](#9-automated-verification--test-suite-implementation)
   - 9.1 API Integration Test Suite (`server/tests/api.test.js`)
   - 9.2 Rental Engine Unit Test Suite (`server/tests/unit.test.js`)
   - 9.3 Complete Test Execution Log Output
10. [Deployment Topology & Cloud Infrastructure](#10-deployment-topology--cloud-infrastructure)
11. [Academic Evaluation Checklist & Demo Guide](#11-academic-evaluation-checklist--demo-guide)
12. [B.Tech Viva Voce Comprehensive Q&A](#12-btech-viva-voce-comprehensive-qa)
13. [Project Directory & File Structure Inventory](#13-project-directory--file-structure-inventory)

---

## 1. Executive Summary & Abstract

Traditional vehicle rental operations in small-to-midsize transportation companies are frequently plagued by fragmented booking logs, paper-based reservation ledgers, error-prone manual tariff calculations, and catastrophic double-booking anomalies during peak travel periods. Furthermore, traditional systems fail to provide fleet managers with real-time operational visibility into vehicle utilization and consolidated revenue metrics.

**DriveEase** is an enterprise-grade, full-stack vehicle rental management web application built to eliminate these operational frictions through end-to-end automation, mathematical verification, and cloud scalability. Engineered on the decoupled **MERN stack (MongoDB, Express.js, React.js, Node.js)**, the application delivers:

1. **A Consumer-Grade Customer Portal**: Intuitive vehicle exploration with dynamic multi-attribute filtering (category, fuel type, transmission, price ranges), keyword search, live date-range availability checks, transparent pricing breakdowns in Indian Rupees (₹), and a self-service customer dashboard for trip management.
2. **An Administrative Command Center**: Restricted by role-based access control (RBAC), offering real-time KPI metrics (total fleet, active listings, active reservations, customer directory, cumulative completed rental revenue), comprehensive fleet inventory CRUD with soft-deactivation protection, and an enforced lifecycle state machine for approving, rejecting, and completing reservations.
3. **A Mathematical Date-Interval Overlap Engine**: An algorithm enforced at the backend service and database layers that prevents duplicate vehicle reservations across concurrent booking requests.
4. **An Enterprise Security Posture**: Salted bcrypt password encryption, stateless JSON Web Token (JWT) authorization, brute-force rate limiting on authentication routes, Helmet HTTP security headers, CORS origin allowlisting, and defensive mass-assignment countermeasures.

---

## 2. System Requirements & Technology Stack

### 2.1 Hardware Requirements
- **Processor**: Intel Core i3 / AMD Ryzen 3 or higher (Quad-Core 2.5 GHz recommended for concurrent frontend and backend local execution).
- **RAM**: Minimum 4 GB (8 GB recommended).
- **Disk Storage**: 500 MB free disk space for node modules and build assets.
- **Network**: Broadband internet connection for MongoDB Atlas cloud cluster communication.

### 2.2 Technology Stack Overview
| Layer | Technologies & Libraries | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18.3.1 | Component-based interactive UI library |
| **Frontend Build Tool** | Vite 6.0.3 | Fast dev server with Hot Module Replacement (HMR) and optimized build bundling |
| **Styling & Icons** | Tailwind CSS 3.4.16, Lucide React 0.468.0 | Utility-first responsive design and modern iconography |
| **Client Routing** | React Router DOM 6.28.0 | Client-side routing with nested routes and guards |
| **HTTP Client** | Axios 1.7.9 | Promise-based HTTP client with request/response interceptors |
| **Notifications** | React Hot Toast 2.4.1 | Non-intrusive UI toast alerts |
| **Backend Runtime** | Node.js (v22+ LTS) | Asynchronous, event-driven JavaScript engine |
| **Backend Framework** | Express.js 5.3.0 | Modern REST API framework with native Promise handling |
| **Database & ODM** | MongoDB Atlas with Mongoose 9.11.4 | Document-oriented cloud database with schema modeling |
| **Password Security** | bcryptjs 3.0.3 | 10-round salted password hashing |
| **Session Security** | jsonwebtoken 9.0.3 | Cryptographic HMAC SHA-256 JWT signing and verification |
| **HTTP Hardening** | Helmet 8.3.0, Express Rate Limit 8.7.1, CORS 2.8.6 | HTTP headers protection, rate limiting, and origin control |
| **Testing** | Node.js Test Runner (`node:test`, `node:assert`), Supertest 7.3.1 | Native assertion and HTTP endpoint testing without third-party runner overhead |

---

## 3. System Architecture & High-Level Design

DriveEase adopts the **Three-Tier Client-Server Architecture** utilizing a decoupled Single Page Application (SPA) frontend and a RESTful backend API service.

```
+---------------------------------------------------------------------------------------+
|                                    PRESENTATION TIER                                  |
|                             React 18 SPA + Vite 6 + Tailwind CSS                      |
|                                                                                       |
|   +---------------------+   +---------------------+   +---------------------------+   |
|   |   Public Pages      |   | Customer Dashboard  |   |   Admin Management Hub    |   |
|   | Home, Fleet, Detail |   | Bookings & Profile  |   | Fleet CRUD, Status, KPIs  |   |
|   +----------+----------+   +----------+----------+   +-------------+-------------+   |
|              |                         |                            |                 |
|              +-------------------------+----------------------------+                 |
|                                        |                                              |
|                                        v                                              |
|                      +-----------------------------------+                            |
|                      | Axios HTTP Client + Interceptors  |                            |
|                      |  - Bearer Token Auto-Injection    |                            |
|                      |  - 401 Session Expiry Catching    |                            |
|                      +-----------------+-----------------+                            |
+----------------------------------------|----------------------------------------------+
                                         | HTTPS / JSON API Requests
                                         v
+---------------------------------------------------------------------------------------+
|                                    APPLICATION TIER                                   |
|                             Node.js + Express.js RESTful API                          |
|                                                                                       |
|   +-------------------------------------------------------------------------------+   |
|   | Security & Guard Layer: Helmet | CORS Allowlist | Express Rate Limiter        |   |
|   +---------------------------------------+---------------------------------------+   |
|                                           |                                           |
|   +---------------------------------------v---------------------------------------+   |
|   | Authentication & Authorization Middleware: JWT Verification | Role Guard      |   |
|   +---------------------------------------+---------------------------------------+   |
|                                           |                                           |
|   +---------------------------------------v---------------------------------------+   |
|   | REST Controllers: AuthController | VehicleController | BookingController      |   |
|   +---------------------------------------+---------------------------------------+   |
|                                           |                                           |
|   +---------------------------------------v---------------------------------------+   |
|   | Business Logic & Service Engines:                                             |   |
|   |  - Date Normalization & Duration Engine (normalizeBookingDates)               |   |
|   |  - Interval Overlap Availability Engine (checkVehicleAvailability)            |   |
|   |  - Server-Side Pricing Engine (calculateRentalPrice)                          |   |
|   |  - Transactional Concurrency Lock (createBookingWithLock)                     |   |
|   |  - State Machine Transition Validator (isValidStatusTransition)               |   |
|   +---------------------------------------+---------------------------------------+   |
+-------------------------------------------|-------------------------------------------+
                                            | Mongoose ODM (BSON over TLS)
                                            v
+---------------------------------------------------------------------------------------+
|                                   PERSISTENCE TIER                                    |
|                       MongoDB Atlas Cloud Cluster (Replica Set)                       |
|                                                                                       |
|   +-----------------------+   +-----------------------+   +-----------------------+   |
|   |   users Collection    |   |  vehicles Collection  |   |  bookings Collection  |   |
|   |  Credentials & Roles  |   |  Inventory & Specs    |   | Active & Past Rentals |   |
|   +-----------------------+   +-----------------------+   +-----------------------+   |
+---------------------------------------------------------------------------------------+
```

### Architectural Principles:
1. **Separation of Concerns (SoC)**: Presentation logic in React components is strictly isolated from data validation and business rules in Express controllers and Mongoose models.
2. **Stateless Scalability**: The backend server maintains no in-memory user sessions. All authenticated requests carry an encrypted, tamper-evident JWT in the `Authorization: Bearer <token>` header.
3. **Single Source of Truth for Calculations**: Pricing, rental durations, and reservation conflicts are computed strictly on the backend. Client-supplied totals are never trusted.

---

## 4. Database Architecture & Actual Schema Code

The persistence layer uses MongoDB with Mongoose ODM schemas. Relations between entities use MongoDB ObjectIds (`mongoose.Schema.Types.ObjectId`) with reference mapping (`ref`).

### 4.1 User Model & Password Hashing
**File Path**: `server/src/models/User.js`

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      minlength: [7, 'Phone number must be at least 7 digits'],
      maxlength: [20, 'Phone number cannot exceed 20 digits']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required']
    },
    role: {
      type: String,
      enum: {
        values: ['customer', 'admin'],
        message: '{VALUE} is not a valid role'
      },
      default: 'customer'
    }
  },
  {
    timestamps: true
  }
);

// Method to verify candidate password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Static helper to hash passwords
userSchema.statics.hashPassword = async function (plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

// Ensure sensitive fields are stripped from JSON serialization
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);
export default User;
```
**Explanation**:
The `User` schema encapsulates user credentials and role-based permissions (`customer` vs `admin`). It defines a static helper `hashPassword` that generates a cryptographic salt of 10 rounds, and an instance method `comparePassword` that compares candidate plaintext against the stored bcrypt hash. Crucially, the `toJSON` transform automatically strips `passwordHash` and `__v` whenever a user document is serialized into an API response.

---

### 4.2 Vehicle Model & Compound Indexing
**File Path**: `server/src/models/Vehicle.js`

```javascript
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
```
**Explanation**:
The `Vehicle` schema enforces comprehensive specifications (category, fuel, transmission, seats, registration plate). Two critical indexes are registered:
1. A **compound index** on `{ category: 1, isActive: 1, pricePerDay: 1 }` allowing the catalog query engine to filter active cars within specified budget ranges with index-level speed ($O(\log N)$).
2. A **text index** on `{ make: 'text', model: 'text', location: 'text' }` powering flexible full-text searches.

---

### 4.3 Booking Model & Relationship References
**File Path**: `server/src/models/Booking.js`

```javascript
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
```
**Explanation**:
The `Booking` schema establishes relations between `User` and `Vehicle` via ObjectId references. It stores immutable snapshots of the rental tariff (`pricePerDayAtBooking` and `totalPrice`) to prevent retroactive pricing modifications if fleet rates change later. Crucially, the compound index `{ vehicle: 1, status: 1, pickupDate: 1, returnDate: 1 }` allows the interval overlap query to evaluate date conflicts directly from index B-trees without full-collection scans.

---

## 5. Core Business Logic & Mathematical Algorithms

The core domain logic is isolated inside `server/src/services/bookingService.js`.

### 5.1 Standardized Date Normalization
**File Path**: `server/src/services/bookingService.js`

```javascript
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
```
**Explanation**:
This algorithm eliminates regional client timezone offsets by setting the pickup boundary to `00:00:00.000 UTC` and the return boundary to `23:59:59.999 UTC`. It enforces that reservations cannot be set in the past and that the return boundary is strictly after the pickup boundary.

---

### 5.2 Mathematical Interval Overlap Engine
**File Path**: `server/src/services/bookingService.js`

```javascript
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
```
**Explanation**:
Implements the mathematical interval-overlap theorem: Two date intervals $[P_1, R_1]$ and $[P_2, R_2]$ overlap if and only if $P_1 < R_2 \land R_1 > P_2$. Only bookings with blocking statuses (`PENDING` or `CONFIRMED`) are treated as conflicts. `REJECTED` and `CANCELLED` bookings release calendar inventory immediately.

---

### 5.3 Server-Authoritative Pricing Calculation
**File Path**: `server/src/services/bookingService.js`

```javascript
export const calculateRentalPrice = (dailyPrice, days) => {
  const basePrice = Math.round(dailyPrice * days);
  return {
    dailyRate: dailyPrice,
    days,
    basePrice,
    totalPrice: basePrice
  };
};
```
**Explanation**:
Calculates rental totals deterministically on the server using verified daily tariffs and billable calendar days. The client is never trusted to calculate totals.

---

### 5.4 Transactional Concurrency Locking
**File Path**: `server/src/services/bookingService.js`

```javascript
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
    await session.startTransaction();
    useTransactions = true;
  } catch (err) {
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
```
**Explanation**:
Prevents Time-of-Check to Time-of-Use (TOCTOU) race conditions by acquiring a multi-document session transaction on MongoDB Atlas. Both the conflict verification and document insertion occur inside an isolated snapshot. If a concurrent transaction commits first, the second transaction fails, aborts, and rolls back cleanly. A fallback path supports standalone non-replica instances during local development.

---

### 5.5 State Machine Lifecycle Transition Logic
**File Path**: `server/src/services/bookingService.js`

```javascript
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
```
**Explanation**:
Enforces valid state machine transitions. Terminal states (`REJECTED`, `CANCELLED`, `COMPLETED`) cannot transition to any other status. A `PENDING` booking cannot jump directly to `COMPLETED` without being `CONFIRMED` first.

---

## 6. Backend Infrastructure & Middleware Implementation

### 6.1 Server Bootstrap & Graceful Shutdown
**File Path**: `server/src/server.js`

```javascript
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to database
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 DriveEase Server running on port ${PORT}`);
    console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🛡️  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=========================================`);
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log('\n[Server] Graceful shutdown initiated. Closing HTTP server...');
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

startServer();
```
**Explanation**:
Initializes the database connection before binding the Express listener. It registers signal handlers for `SIGINT` and `SIGTERM` ensuring inflight HTTP requests are cleanly concluded before process exit.

---

### 6.2 Express Application Setup, CORS & Security Headers
**File Path**: `server/src/app.js`

```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { isDBConnected } from './config/db.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS blocked by DriveEase Security Policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsing with safe size limit
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate limiting on sensitive authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes.'
  }
});
app.use('/api/auth', authLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = isDBConnected() ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    service: 'DriveEase Backend API',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Fallback handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
```
**Explanation**:
Configures Helmet for security headers, strict CORS domain allowlisting, express.json size capping to prevent denial of service (DoS), brute-force rate limiting on authentication routes, and health monitoring at `/api/health`.

---

### 6.3 Database Connection & Health Verification
**File Path**: `server/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/driveease';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      console.warn('[Database] Running in disconnected state; retrying connection in background.');
    }
    return null;
  }
};

export const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};
```
**Explanation**:
Connects to MongoDB Atlas using Mongoose with a 5-second connection timeout. The `isDBConnected` helper allows health checks to report database connectivity dynamically.

---

### 6.4 JWT Authentication & Role Authorization Guard
**File Path**: `server/src/middleware/auth.js`

```javascript
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'driveease_jwt_secret_dev_key_2026';

export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session. User no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' is not authorized to access this resource.`
      });
    }

    next();
  };
};

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};
```
**Explanation**:
`authenticate` verifies the JWT token from the `Authorization: Bearer <token>` header, decodes the claims, and attaches the live user document to `req.user`. `authorize('admin')` verifies that the authenticated user possesses the required administrative privileges. `generateToken` signs new tokens with a 7-day expiration window.

---

### 6.5 Centralized Error & 404 Handlers
**File Path**: `server/src/middleware/errorHandler.js`

```javascript
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for field: ${err.path}`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = errors.join(', ');
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `A record with this ${field} already exists`;
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};
```
**Explanation**:
Catches and translates common exceptions into uniform HTTP status codes: CastErrors (400), Mongoose ValidationErrors (400), MongoDB Duplicate Keys (409), and JWT Errors (401). Stack traces are hidden in production.

---

### 6.6 Input Validation Middleware
**File Path**: `server/src/middleware/validate.js`

```javascript
import mongoose from 'mongoose';

export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID parameter: '${id}' is not a valid identifier.`
      });
    }
    next();
  };
};

export const validateRequiredFields = (fields = []) => {
  return (req, res, next) => {
    const missing = [];
    for (const field of fields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required field(s): ${missing.join(', ')}`
      });
    }
    next();
  };
};
```
**Explanation**:
Validates that incoming URL parameters conform to the 24-character hexadecimal MongoDB ObjectId standard before running database queries, preventing CastError crashes.

---

## 7. RESTful API Endpoints & Controller Code

### 7.1 Authentication Module (`authController.js`)
**File Path**: `server/src/controllers/authController.js`

#### Endpoint: `POST /api/auth/register`
```javascript
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and password are all required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    const passwordHash = await User.hashPassword(password);

    // Explicitly enforce role as 'customer' to prevent mass assignment of 'admin'
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      passwordHash,
      role: 'customer'
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
```

#### Endpoint: `POST /api/auth/login`
```javascript
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
```
**Explanation**:
`register` validates mandatory inputs and password length ($\ge 6$), checks uniqueness of the normalized email, generates a salted hash via bcrypt, and explicitly forces `role: 'customer'` (defending against mass-assignment privilege escalation). `login` compares candidate passwords securely and issues signed JWT tokens upon success.

---

### 7.2 Vehicle Fleet Management (`vehicleController.js`)
**File Path**: `server/src/controllers/vehicleController.js`

#### Endpoint: `GET /api/vehicles` (Catalog Filtering & Pagination)
```javascript
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

    if (all === 'true' && req.user && req.user.role === 'admin') {
      // Admin can view deactivated vehicles
    } else {
      query.isActive = true;
    }

    if (category) query.category = category;
    if (fuelType) query.fuelType = fuelType;
    if (transmission) query.transmission = transmission;

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
```

#### Endpoint: `GET /api/vehicles/:id/availability`
```javascript
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
```
**Explanation**:
`getVehicles` builds dynamic MongoDB queries combining exact enum filters (`category`, `fuelType`), regex queries across make and model, and range filters on `pricePerDay`, returning paginated results. `checkAvailability` inspects whether a specific vehicle has booking overlaps and calculates the server price breakdown.

---

### 7.3 Booking & Reservation Controller (`bookingController.js`)
**File Path**: `server/src/controllers/bookingController.js`

#### Endpoint: `POST /api/bookings`
```javascript
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
```

#### Endpoint: `PATCH /api/bookings/:id/cancel`
```javascript
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
```
**Explanation**:
`createBooking` leverages `createBookingWithLock` to verify availability and persist reservations atomically under session locks. `cancelBooking` verifies ownership or admin authority, ensures the rental has not yet started, transitions the status to `CANCELLED`, and logs the cancellation reason.

---

### 7.4 Administration Analytics & State Transitions (`adminController.js`)
**File Path**: `server/src/controllers/adminController.js`

#### Endpoint: `GET /api/admin/dashboard`
```javascript
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
```

#### Endpoint: `PATCH /api/admin/bookings/:id/status`
```javascript
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

    if (!isValidStatusTransition(booking.status, status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition: cannot change booking status from '${booking.status}' to '${status}'`
      });
    }

    // Recheck availability if confirming
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
```
**Explanation**:
`getDashboardStats` runs concurrent database queries via `Promise.all` alongside a MongoDB aggregation pipeline (`$match` status `COMPLETED`, `$group` sum `totalPrice`) to compute total revenue. `updateBookingStatus` enforces valid state transitions and performs a critical re-check of availability prior to confirming reservations.

---

## 8. Frontend Architecture & Component Implementation

### 8.1 React DOM Entry Point
**File Path**: `client/src/main.jsx`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```
**Explanation**:
Bootstraps the React 18 application into the `#root` DOM element wrapped in `React.StrictMode` to catch lifecycle inconsistencies during development.

---

### 8.2 Application Router & Layout Wrapper
**File Path**: `client/src/App.jsx`

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

import HomePage from './pages/HomePage';
import VehiclesPage from './pages/VehiclesPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#fff',
                fontSize: '13px',
                borderRadius: '12px'
              }
            }}
          />

          <Navbar />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Customer Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <CustomerDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Console */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
```
**Explanation**:
Configures client-side routing with `react-router-dom`, wraps the tree in `AuthProvider`, configures global toast notifications via `react-hot-toast`, and binds `ProtectedRoute` and `AdminRoute` security guards.

---

### 8.3 Global State Management: AuthContext
**File Path**: `client/src/context/AuthContext.jsx`

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('driveease_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('driveease_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Synchronize on load: verify token with /api/auth/me
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('driveease_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.data?.success && res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('driveease_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('[Auth] Session validation failed; logging out.');
          logout();
        }
      }
      setLoading(false);
    };

    verifySession();

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.data?.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem('driveease_token', receivedToken);
      localStorage.setItem('driveease_user', JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
      return receivedUser;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const logout = () => {
    localStorage.removeItem('driveease_token');
    localStorage.removeItem('driveease_user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```
**Explanation**:
Provides global authentication state, token storage, and session verification against `/api/auth/me`. Listens for global `auth:unauthorized` events emitted by Axios interceptors to automatically log out users upon token expiration.

---

### 8.4 Axios HTTP Client & JWT Interceptors
**File Path**: `client/src/services/api.js`

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor: automatically inject JWT token if user is authenticated
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('driveease_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: standardizes error messages and handles session expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentToken = localStorage.getItem('driveease_token');
      if (currentToken) {
        localStorage.removeItem('driveease_token');
        localStorage.removeItem('driveease_user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me')
};

export const vehicleService = {
  getVehicles: (params) => api.get('/vehicles', { params }),
  getVehicleById: (id) => api.get(`/vehicles/${id}`),
  checkAvailability: (id, pickupDate, returnDate) =>
    api.get(`/vehicles/${id}/availability`, { params: { pickupDate, returnDate } })
};

export const bookingService = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my'),
  cancelBooking: (id, reason) => api.patch(`/bookings/${id}/cancel`, { reason })
};

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllBookings: (params) => api.get('/admin/bookings', { params }),
  updateBookingStatus: (id, status, reason) =>
    api.patch(`/admin/bookings/${id}/status`, { status, reason })
};

export default api;
```
**Explanation**:
Configures Axios with a base URL and 10-second timeout. The request interceptor injects the Bearer token into outgoing requests. The response interceptor catches 401 Unauthorized responses, clears local storage, and dispatches an event to trigger client logout.

---

### 8.5 Protected Route Guards
**File Path**: `client/src/components/common/ProtectedRoute.jsx` & `AdminRoute.jsx`

```javascript
// ProtectedRoute.jsx
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner text="Checking authorization..." size="lg" />;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
};

// AdminRoute.jsx
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner text="Verifying administrator credentials..." size="lg" />;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};
```
**Explanation**:
`ProtectedRoute` restricts access to logged-in customers, capturing intended destination paths for seamless post-login redirection. `AdminRoute` verifies that the authenticated user possesses `role === 'admin'`.

---

### 8.6 Vehicle Card Component
**File Path**: `client/src/components/common/VehicleCard.jsx`

```javascript
export const VehicleCard = ({ vehicle }) => {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(
    vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : FALLBACK_IMAGE
  );

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        <img
          src={imgSrc}
          alt={`${vehicle.make} ${vehicle.model}`}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
            {vehicle.category}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-900/75 backdrop-blur-md text-white shadow-sm">
            {vehicle.year}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{vehicle.location || 'Available Citywide'}</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
            {vehicle.make} <span className="font-semibold text-slate-700">{vehicle.model}</span>
          </h3>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg">
              <Users className="w-4 h-4 text-brand-600" />
              <span>{vehicle.seats} Seats</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg">
              <Fuel className="w-4 h-4 text-brand-600" />
              <span className="truncate">{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg">
              <Settings2 className="w-4 h-4 text-brand-600" />
              <span className="truncate">{vehicle.transmission}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Daily Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900">
                ₹{vehicle.pricePerDay.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ day</span>
            </div>
          </div>

          <button
            onClick={() => navigate(`/vehicles/${vehicle._id}?action=book`)}
            disabled={!vehicle.isActive}
            className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all shadow-sm flex items-center gap-1"
          >
            Book Now
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
```
**Explanation**:
Displays vehicle attributes, transmission, seating capacity, daily pricing, and image fallbacks in a responsive card component.

---

### 8.7 Vehicle Detail, Live Availability & Booking Flow
**File Path**: `client/src/pages/VehicleDetailPage.jsx`

```javascript
  const handleCheckAvailability = async (pDate = pickupDate, rDate = returnDate) => {
    if (!pDate || !rDate) return;
    setCheckingAvailability(true);
    try {
      const res = await vehicleService.checkAvailability(id, pDate, rDate);
      if (res.data?.success) {
        setAvailabilityResult(res.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error checking vehicle availability');
      setAvailabilityResult(null);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleConfirmBooking = async () => {
    setBookingInProgress(true);
    try {
      const res = await bookingService.createBooking({
        vehicleId: id,
        pickupDate,
        returnDate
      });

      if (res.data?.success) {
        toast.success('Reservation placed successfully! Redirecting to dashboard...');
        setConfirmModalOpen(false);
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place booking');
    } finally {
      setBookingInProgress(false);
    }
  };
```
**Explanation**:
Coordinates the customer booking workflow: validates pickup/return dates, sends asynchronous requests to `/api/vehicles/:id/availability`, renders real-time pricing and date collision indicators, and triggers `createBooking` under modal confirmation.

---

### 8.8 Login Form with 1-Click Lab Demo Autofill
**File Path**: `client/src/pages/LoginPage.jsx`

```javascript
  const fillDemoCustomer = () => {
    setEmail('customer@driveease.com');
    setPassword('Customer@12345!');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@driveease.com');
    setPassword('Admin@SecureDrive2026!');
  };
```
**Explanation**:
Provides single-click credentials autofill buttons during laboratory evaluations and academic project reviews.

---

## 9. Automated Verification & Test Suite Implementation

### 9.1 API Integration Test Suite
**File Path**: `server/tests/api.test.js`

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

test('--- API Integration Tests: DriveEase Security & Endpoints ---', async (t) => {
  await t.test('1. Health Check: GET /api/health responds with 200 and operational status', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
    assert.equal(res.body.service, 'DriveEase Backend API');
    assert.ok(res.body.uptime !== undefined);
  });

  await t.test('2. 404 Handler: unknown routes return standard 404 JSON response', async () => {
    const res = await request(app).get('/api/non-existent-route-404');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /Resource not found/);
  });

  await t.test('3. Auth Guard: access to private endpoint /api/bookings without token returns 401', async () => {
    const res = await request(app).get('/api/bookings/my');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /Authentication required/);
  });

  await t.test('4. Registration Validation: returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'incomplete@example.com' });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /Name, email, phone, and password are all required/);
  });

  await t.test('5. Registration Validation: returns 400 when password is too short (< 6 chars)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '+919999999999',
        password: '123'
      });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /Password must be at least 6 characters long/);
  });

  await t.test('6. ObjectId Validation: returns 400 for malformed vehicle IDs', async () => {
    const res = await request(app).get('/api/vehicles/invalid-not-an-objectid');
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /not a valid identifier/);
  });
});
```
**Explanation**:
Executes end-to-end integration assertions against the live Express router using Supertest.

---

### 9.2 Rental Engine Unit Test Suite
**File Path**: `server/tests/unit.test.js`

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  normalizeBookingDates,
  calculateRentalPrice,
  isValidStatusTransition
} from '../src/services/bookingService.js';
import { generateToken } from '../src/middleware/auth.js';

test('--- Unit Tests: DriveEase Rental Engine ---', async (t) => {
  await t.test('1. Password Hashing: verifies bcrypt hash and comparison', async () => {
    const password = 'SecretPassword123!';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    assert.notEqual(password, hash);
    const isMatch = await bcrypt.compare(password, hash);
    assert.equal(isMatch, true);

    const isWrongMatch = await bcrypt.compare('WrongPassword', hash);
    assert.equal(isWrongMatch, false);
  });

  await t.test('2. JWT Generation & Payload: encodes user id and role', () => {
    const mockUser = {
      _id: '64b1f2e8c201a4f3b8901234',
      email: 'customer@driveease.com',
      role: 'customer'
    };

    const token = generateToken(mockUser);
    assert.ok(token);

    const decoded = jwt.decode(token);
    assert.equal(decoded.id, mockUser._id);
    assert.equal(decoded.email, mockUser.email);
    assert.equal(decoded.role, mockUser.role);
  });

  await t.test('3. Date Normalization: rejects dates in the past', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    assert.throws(
      () => normalizeBookingDates(yesterday, tomorrow),
      /Pickup date cannot be in the past/
    );
  });

  await t.test('4. Date Normalization: rejects return date before or equal to pickup date', () => {
    const futureDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const earlierDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    assert.throws(
      () => normalizeBookingDates(futureDate, earlierDate),
      /Return date must be strictly after pickup date/
    );
  });

  await t.test('5. Date Normalization & Duration: accurately calculates rental days (inclusive)', () => {
    const pickup = '2027-01-10';
    const returnDate = '2027-01-14';

    const { numberOfDays } = normalizeBookingDates(pickup, returnDate);
    assert.equal(numberOfDays, 5);
  });

  await t.test('6. Price Calculation: strictly calculates total based on daily rate and days', () => {
    const dailyRate = 2499;
    const days = 5;

    const calculation = calculateRentalPrice(dailyRate, days);
    assert.equal(calculation.dailyRate, 2499);
    assert.equal(calculation.days, 5);
    assert.equal(calculation.totalPrice, 12495);
  });

  await t.test('7. Interval Overlap Formula: standard interval-overlap rule verification', () => {
    const isOverlap = (exP, exR, reqP, reqR) => exP < reqR && exR > reqP;

    const exStart = new Date('2027-02-10T00:00:00.000Z');
    const exEnd = new Date('2027-02-15T23:59:59.999Z');

    assert.equal(isOverlap(exStart, exEnd, new Date('2027-02-10T00:00:00.000Z'), new Date('2027-02-15T23:59:59.999Z')), true);
    assert.equal(isOverlap(exStart, exEnd, new Date('2027-02-12T00:00:00.000Z'), new Date('2027-02-18T23:59:59.999Z')), true);
    assert.equal(isOverlap(exStart, exEnd, new Date('2027-02-05T00:00:00.000Z'), new Date('2027-02-20T23:59:59.999Z')), true);
    assert.equal(isOverlap(exStart, exEnd, new Date('2027-02-16T00:00:00.000Z'), new Date('2027-02-20T23:59:59.999Z')), false);
    assert.equal(isOverlap(exStart, exEnd, new Date('2027-02-01T00:00:00.000Z'), new Date('2027-02-08T23:59:59.999Z')), false);
  });

  await t.test('8. Booking Status Transitions: strictly enforces valid lifecycle states', () => {
    assert.equal(isValidStatusTransition('PENDING', 'CONFIRMED'), true);
    assert.equal(isValidStatusTransition('PENDING', 'REJECTED'), true);
    assert.equal(isValidStatusTransition('PENDING', 'CANCELLED'), true);
    assert.equal(isValidStatusTransition('PENDING', 'COMPLETED'), false);
    assert.equal(isValidStatusTransition('CONFIRMED', 'COMPLETED'), true);
    assert.equal(isValidStatusTransition('CONFIRMED', 'CANCELLED'), true);
    assert.equal(isValidStatusTransition('CANCELLED', 'CONFIRMED'), false);
  });
});
```
**Explanation**:
Verifies password hashing, token claims, date boundary math, pricing formulas, overlap theorem cases, and state machine transition rules.

---

### 9.3 Complete Test Execution Log Output
```
> driveease-server@1.0.0 test
> node --test tests/*.test.js

▶ --- API Integration Tests: DriveEase Security & Endpoints ---
  ✔ 1. Health Check: GET /api/health responds with 200 and operational status (45.9ms)
  ✔ 2. 404 Handler: unknown routes return standard 404 JSON response (5.8ms)
  ✔ 3. Auth Guard: access to private endpoint /api/bookings without token returns 401 (7.5ms)
  ✔ 4. Registration Validation: returns 400 when required fields are missing (20.3ms)
  ✔ 5. Registration Validation: returns 400 when password is too short (< 6 chars) (6.4ms)
  ✔ 6. ObjectId Validation: returns 400 for malformed vehicle IDs (4.3ms)
✔ --- API Integration Tests: DriveEase Security & Endpoints --- (92.7ms)

▶ --- Unit Tests: DriveEase Rental Engine ---
  ✔ 1. Password Hashing: verifies bcrypt hash and comparison (273.0ms)
  ✔ 2. JWT Generation & Payload: encodes user id and role (2.7ms)
  ✔ 3. Date Normalization: rejects dates in the past (6.1ms)
  ✔ 4. Date Normalization: rejects return date before or equal to pickup date (0.2ms)
  ✔ 5. Date Normalization & Duration: accurately calculates rental days (inclusive) (0.2ms)
  ✔ 6. Price Calculation: strictly calculates total based on daily rate and days (0.2ms)
  ✔ 7. Interval Overlap Formula: standard interval-overlap rule verification (0.2ms)
  ✔ 8. Booking Status Transitions: strictly enforces valid lifecycle states (0.2ms)
✔ --- Unit Tests: DriveEase Rental Engine --- (285.6ms)

============================================================
Total Tests: 16 | Passed: 16 | Failed: 0 | Execution Time: ~1.06s
============================================================
```

---

## 10. Deployment Topology & Cloud Infrastructure

### 10.1 Render Infrastructure as Code (`render.yaml`)
```yaml
services:
  - type: web
    name: driveease-server
    runtime: node
    rootDir: server
    buildCommand: npm install
    startCommand: npm start
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: CLIENT_URL
        sync: false
```

### 10.2 Vercel SPA Client Rewrite (`client/vercel.json`)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 11. Academic Evaluation Checklist & Demo Guide

| Step | Objective | Procedure | Expected Verification Result |
| :---: | :--- | :--- | :--- |
| **1** | **Health Inspection** | Navigate to `http://localhost:5000/api/health` | HTTP 200 returned with `{ status: "ok", database: "connected", uptime: ... }`. |
| **2** | **Catalog Browsing** | Navigate to `/vehicles` and click category `"SUV"` | Listing instantly filters to SUVs (Nexon, Creta, Thar). |
| **3** | **Date Validation** | Pick return date before pickup date | Frontend blocks submission; backend throws invalid boundary error. |
| **4** | **Availability Check** | Pick upcoming dates for Maruti Swift | Live badge displays *"Available for X rental days"* with itemized pricing. |
| **5** | **Auth Redirection** | Click "Proceed to Book" while unauthenticated | System redirects to `/login?redirect=...` preserving booking target. |
| **6** | **Demo Autofill** | On `/login`, click `"Customer Demo"` button | Credentials autofill (`customer@driveease.com`). Login succeeds with welcome toast. |
| **7** | **Booking Placement**| Submit reservation for 3 days | Navigates to `/dashboard`; booking appears with `PENDING` badge. |
| **8** | **Overlap Detection**| In incognito window, attempt to book the same vehicle for overlapping dates | System displays warning: *"Vehicle is already booked or reserved for these dates"*. |
| **9** | **Admin Authentication**| Log in using `"Admin Demo"` (`admin@driveease.com`) | Console opens at `/admin` displaying real-time KPI metrics and revenue totals. |
| **10**| **Booking Approval** | In Admin bookings table, click `"Confirm"` | Status updates to `CONFIRMED`; availability is locked across platform. |
| **11**| **Rental Completion**| In Admin bookings table, click `"Complete"` | Status transitions to `COMPLETED`; platform revenue KPI metric increases accordingly. |
| **12**| **Access Control** | Log in as customer and attempt to visit `/admin` | Route guard redirects user to home page (`403 Forbidden`). |

---

## 12. B.Tech Viva Voce Comprehensive Q&A

### Q1: What architecture does DriveEase follow, and why was the MERN stack chosen?
> **Answer**: DriveEase adopts a decoupled **Three-Tier Client-Server Architecture** separating Presentation (React SPA), Application Logic (Node.js/Express.js REST API), and Persistence (MongoDB Atlas).  
> The MERN stack was chosen because:
> 1. JavaScript/JSON is unified across the entire stack, eliminating serialization/impedance mismatches.
> 2. Node's non-blocking, event-driven I/O handles concurrent API requests efficiently.
> 3. MongoDB's document model naturally represents rich entities like vehicles (with embedded image arrays and nested specs) without requiring complex multi-table SQL joins.

---

### Q2: How does the system mathematically prevent double-booking (interval overlap)?
> **Answer**: Double-booking is prevented using the interval-overlap theorem. Two time intervals $[P_1, R_1]$ and $[P_2, R_2]$ overlap if and only if:
> $$P_1 < R_2 \quad \land \quad R_1 > P_2$$
> In DriveEase:
> - $P_1, R_1$ represent existing active bookings (`PENDING` or `CONFIRMED`).
> - $P_2, R_2$ represent the requested dates.  
> Dates are normalized to UTC midnight boundaries before evaluation. If any existing document matches this query for the vehicle, the new reservation is rejected.

---

### Q3: How do you handle race conditions when two customers attempt to book the same vehicle at the exact same millisecond?
> **Answer**: Simple query-then-insert flows suffer from Time-of-Check to Time-of-Use (TOCTOU) race conditions. DriveEase overcomes this by utilizing **MongoDB Multi-Document Session Transactions** (`session.startTransaction()`) supported on MongoDB Atlas replica sets. Both the availability check and booking insertion occur within an isolated database transaction under snapshot isolation. If a concurrent transaction commits first, the second transaction detects the conflict, aborts, and rolls back cleanly without data corruption.

---

### Q4: Why did you choose stateless JWT authentication over server-side session cookies?
> **Answer**:
> 1. **Horizontal Scalability**: The server maintains no in-memory session store (like Redis). Any load-balanced backend instance can verify incoming tokens independently using the shared `JWT_SECRET`.
> 2. **Cross-Origin & Multi-Client Support**: JWT tokens transmitted via `Authorization: Bearer <token>` work seamlessly across different host domains, third-party microservices, and mobile apps without third-party cookie restrictions.
> 3. **Tamper Detection**: Any client-side alteration of user ID or role invalidates the cryptographic HMAC signature, triggering immediate rejection.

---

### Q5: How does DriveEase protect against mass-assignment vulnerabilities during registration?
> **Answer**: Mass-assignment occurs when client payloads bind untrusted properties directly to database records (e.g. submitting `{ "name": "Eve", "role": "admin" }`). In DriveEase, `authController.js` ignores client-submitted role fields and explicitly sets `role: 'customer'` during `User.create()`. Administrative accounts can only be provisioned through explicit backend seed scripts or database administrator access.

---

### Q6: What is the purpose of `client/vercel.json`?
> **Answer**: DriveEase is a Single Page Application (SPA) using React Router for client-side routing. On static hosts like Vercel, when a user accesses or refreshes a deep link like `/vehicles/673b1f2e` or `/dashboard`, the web server attempts to find a file at that disk path. Because that path does not exist, the server would return a 404 error. The rewrite rule in `vercel.json` instructs the web server to always serve `index.html`, allowing React Router in the browser to parse the route and render the appropriate component.

---

### Q7: Why do we normalize dates to UTC midnight before persisting them to MongoDB?
> **Answer**: Clients operating across different timezones submit date strings with local offsets. For example, selecting "2026-11-15" in India (UTC+05:30) produces an ISO timestamp of `2026-11-14T18:30:00.000Z`. If compared directly against a server running in UTC, date boundaries shift into the prior day. Standardizing pickup dates to `00:00:00.000 UTC` and return dates to `23:59:59.999 UTC` guarantees calendar-day comparisons remain deterministic regardless of regional client timezones.

---

### Q8: What is the difference between soft deletion and hard deletion, and which does DriveEase implement?
> **Answer**:
> - **Hard Deletion**: Permanently removes the document from the database (`deleteOne()`).
> - **Soft Deletion**: Modifies a boolean flag (`isActive: false`), hiding the record from customer listings while preserving the document in the database.  
> DriveEase implements a **hybrid deletion policy** in `vehicleController.js`: if a vehicle has historical or active bookings, hard deletion is blocked and `isActive` is set to `false`. This protects referential integrity so past customer invoices, receipts, and admin revenue audits never point to orphaned foreign keys.

---

### Q9: How does the backend prevent Cross-Origin Resource Sharing (CORS) security issues?
> **Answer**: The backend implements `cors` middleware with an explicit origin allowlist checking `process.env.CLIENT_URL` alongside authorized development localhost origins. If an unauthorized origin initiates a cross-origin request, the server rejects it. In production, requests lacking authorized headers or originating from unknown sites are blocked before executing controller logic.

---

### Q10: How are database credentials and secrets secured throughout the development lifecycle?
> **Answer**: Secrets are stored strictly in environment variable files (`.env`) registered in `.gitignore` and never committed to version control. Configuration templates with placeholder variables are provided in `.env.example`. In production on Render, secrets (`MONGODB_URI`, `JWT_SECRET`) are injected securely through environment management consoles directly into container runtimes.

---

### Q11: What indexes exist in the DriveEase database, and what queries do they accelerate?
> **Answer**:
> 1. In `vehicles`:
>    - Compound Index `{ category: 1, isActive: 1, pricePerDay: 1 }`: Accelerates catalog filtering by category, status, and price range.
>    - Text Index `{ make: "text", model: "text", location: "text" }`: Enables full-text search across vehicle make, model, and location hub.
> 2. In `bookings`:
>    - Compound Index `{ vehicle: 1, status: 1, pickupDate: 1, returnDate: 1 }`: Accelerates interval overlap availability queries.

---

### Q12: Why did you use Express 5 and Mongoose 9 in this project?
> **Answer**: Express 5 natively supports returning promises from middleware and route handlers, eliminating the need for boilerplate `asyncHandler` wrappers to catch rejected promises. Mongoose 9 provides optimized schema indexing, improved TypeScript/ES Module type definitions, strict query sanitization, and seamless integration with MongoDB Atlas multi-document transactions.

---

## 13. Project Directory & File Structure Inventory

```
driveease/
├── .gitignore                      # Git exclusion rules (node_modules, .env, build outputs)
├── package.json                    # Monorepo root workspace scripts (dev, test, start)
├── package-lock.json               # Root lockfile
├── render.yaml                     # Render Infrastructure-as-Code deployment blueprint
├── README.md                       # Repository overview and setup instructions
├── DOCUMENTATION.md                # Original documentation file
├── PROJECT_DOCUMENTATION.md        # Technical Documentation with Actual Source Code (this file)
├── PROJECT_DOCUMENTATION.pdf       # Compiled Presentation PDF Report with Code
│
├── client/                         # Frontend React 18 Application (Vite 6 + Tailwind CSS)
│   ├── .env.example                # Frontend environment variable template
│   ├── index.html                  # Single Page Application HTML entry point
│   ├── package.json                # Frontend package dependencies & scripts
│   ├── postcss.config.js           # PostCSS Tailwind processor configuration
│   ├── tailwind.config.js          # Tailwind theme extensions & color palettes
│   ├── vercel.json                 # Vercel SPA rewrite rules
│   ├── vite.config.js              # Vite bundler & development server configuration
│   └── src/
│       ├── App.jsx                 # Routing table & context providers
│       ├── main.jsx                # React DOM render entry point
│       ├── index.css               # Tailwind directives & custom CSS
│       ├── components/common/      # Reusable UI components
│       │   ├── Navbar.jsx          # Top navigation bar with auth badges
│       │   ├── Footer.jsx          # Platform footer with links & contact info
│       │   ├── VehicleCard.jsx     # Vehicle card with specs and image fallback
│       │   ├── StatusBadge.jsx     # Color-coded badges for booking lifecycle
│       │   ├── LoadingSpinner.jsx  # SVG loading spinner
│       │   ├── ProtectedRoute.jsx  # Customer authentication guard
│       │   └── AdminRoute.jsx      # Administrator authorization guard
│       ├── context/
│       │   └── AuthContext.jsx     # User session, JWT storage & login/logout state
│       ├── pages/
│       │   ├── HomePage.jsx        # Landing page with hero, search, & testimonials
│       │   ├── VehiclesPage.jsx    # Fleet catalog with filters & pagination
│       │   ├── VehicleDetailPage.jsx # Specifications, date picker, availability check
│       │   ├── LoginPage.jsx       # Sign-in form with 1-click Demo credentials
│       │   ├── RegisterPage.jsx    # Registration form with input validation
│       │   ├── CustomerDashboardPage.jsx # Trip tabs, cancel modal, profile editor
│       │   ├── AdminDashboardPage.jsx # KPI analytics, fleet CRUD, status actions
│       │   └── NotFoundPage.jsx    # 404 error page
│       └── services/
│           └── api.js              # Axios client, Bearer interceptor & API endpoints
│
└── server/                         # Backend Express 5 REST API (Node.js)
    ├── .env.example                # Server environment configuration template
    ├── package.json                # Server dependencies & test scripts
    ├── scripts/
    │   └── seed.js                 # Idempotent database seeder (Users + 9 Vehicles)
    ├── tests/
    │   ├── api.test.js             # API integration test suite (Supertest)
    │   └── unit.test.js            # Unit test suite (Node test runner)
    └── src/
        ├── app.js                  # Express middleware, CORS, Helmet, Rate limiter
        ├── server.js               # HTTP listener & graceful shutdown handlers
        ├── config/
        │   └── db.js               # MongoDB connection logic & health checker
        ├── controllers/
        │   ├── authController.js   # Register, Login, Me, Update Profile
        │   ├── vehicleController.js# Vehicle CRUD, Availability & Filtering
        │   ├── bookingController.js# Booking placement, Cancel, Customer view
        │   └── adminController.js  # Dashboard KPIs, Platform bookings, Status transitions
        ├── middleware/
        │   ├── auth.js             # JWT verification & role authorization guard
        │   ├── errorHandler.js     # Centralized error handler & 404 fallback
        │   └── validate.js         # ObjectId validation & required fields checks
        ├── models/
        │   ├── User.js             # User Mongoose schema & bcrypt methods
        │   ├── Vehicle.js          # Vehicle Mongoose schema & compound indexes
        │   └── Booking.js          # Booking Mongoose schema & interval compound index
        ├── routes/
        │   ├── authRoutes.js       # Routes for /api/auth
        │   ├── vehicleRoutes.js    # Routes for /api/vehicles
        │   ├── bookingRoutes.js    # Routes for /api/bookings
        │   └── adminRoutes.js      # Routes for /api/admin
        └── services/
            └── bookingService.js   # Availability engine, Date normalization, Pricing
```

---
*End of Technical Documentation — DriveEase Vehicle Rental Management System*

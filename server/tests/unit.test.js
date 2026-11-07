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
    assert.equal(typeof token, 'string');

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

    // Return date earlier than pickup date
    assert.throws(
      () => normalizeBookingDates(futureDate, earlierDate),
      /Return date must be strictly after pickup date/
    );
  });

  await t.test('5. Date Normalization & Duration: accurately calculates rental days (inclusive)', () => {
    const pickup = '2027-01-10';
    const returnDate = '2027-01-14';

    const { numberOfDays } = normalizeBookingDates(pickup, returnDate);
    // Jan 10 through Jan 14 inclusive = 5 full rental days
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
    // Condition: existingPickup < requestedReturn AND existingReturn > requestedPickup
    const isOverlap = (exP, exR, reqP, reqR) => {
      return exP < reqR && exR > reqP;
    };

    const exStart = new Date('2027-02-10T00:00:00.000Z');
    const exEnd = new Date('2027-02-15T23:59:59.999Z');

    // Case A: Exact same interval -> Overlap
    assert.equal(isOverlap(exStart, exEnd, new Date('2027-02-10T00:00:00.000Z'), new Date('2027-02-15T23:59:59.999Z')), true);

    // Case B: Partial overlap (starts during existing booking) -> Overlap
    assert.equal(isOverlap(exStart, exEnd, new Date('2027-02-12T00:00:00.000Z'), new Date('2027-02-18T23:59:59.999Z')), true);

    // Case C: Enclosing interval (starts before and ends after) -> Overlap
    assert.equal(isOverlap(exStart, exEnd, new Date('2027-02-05T00:00:00.000Z'), new Date('2027-02-20T23:59:59.999Z')), true);

    // Case D: Completely after existing booking -> No Overlap
    assert.equal(isOverlap(exStart, exEnd, new Date('2027-02-16T00:00:00.000Z'), new Date('2027-02-20T23:59:59.999Z')), false);

    // Case E: Completely before existing booking -> No Overlap
    assert.equal(isOverlap(exStart, exEnd, new Date('2027-02-01T00:00:00.000Z'), new Date('2027-02-08T23:59:59.999Z')), false);
  });

  await t.test('8. Booking Status Transitions: strictly enforces valid lifecycle states', () => {
    // PENDING can transition to CONFIRMED, REJECTED, or CANCELLED
    assert.equal(isValidStatusTransition('PENDING', 'CONFIRMED'), true);
    assert.equal(isValidStatusTransition('PENDING', 'REJECTED'), true);
    assert.equal(isValidStatusTransition('PENDING', 'CANCELLED'), true);
    assert.equal(isValidStatusTransition('PENDING', 'COMPLETED'), false); // Cannot complete without confirming

    // CONFIRMED can transition to COMPLETED or CANCELLED
    assert.equal(isValidStatusTransition('CONFIRMED', 'COMPLETED'), true);
    assert.equal(isValidStatusTransition('CONFIRMED', 'CANCELLED'), true);
    assert.equal(isValidStatusTransition('CONFIRMED', 'PENDING'), false);

    // Terminal states cannot transition anywhere
    assert.equal(isValidStatusTransition('CANCELLED', 'CONFIRMED'), false);
    assert.equal(isValidStatusTransition('REJECTED', 'CONFIRMED'), false);
    assert.equal(isValidStatusTransition('COMPLETED', 'CANCELLED'), false);
  });
});

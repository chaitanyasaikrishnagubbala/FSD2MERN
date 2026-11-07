import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '../src/app.js';

const JWT_SECRET = process.env.JWT_SECRET || 'driveease_jwt_secret_dev_key_2026';

// Generate mock test tokens
const customerToken = jwt.sign(
  { id: '64b1f2e8c201a4f3b8901234', email: 'customer@driveease.com', role: 'customer' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

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
      .send({
        email: 'incomplete@example.com'
        // Missing name, phone, password
      });

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

const request = require('supertest');
const { app } = require('../server');
const { connectTestDB, disconnectTestDB, clearCollections } = require('./setup');

let customerToken;
let workerToken;
let workerProfileId;

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await clearCollections();

  // Create customer
  await request(app).post('/api/auth/register').send({
    name: 'Test Customer',
    email: 'customer@test.com',
    password: 'password123',
    role: 'customer',
  });
  const custLogin = await request(app).post('/api/auth/login').send({
    email: 'customer@test.com',
    password: 'password123',
  });
  customerToken = custLogin.body.data.token;

  // Create worker
  await request(app).post('/api/auth/register').send({
    name: 'Test Worker',
    email: 'worker@test.com',
    password: 'password123',
    role: 'worker',
  });
  const wrkLogin = await request(app).post('/api/auth/login').send({
    email: 'worker@test.com',
    password: 'password123',
  });
  workerToken = wrkLogin.body.data.token;

  // Create worker profile
  const profileRes = await request(app)
    .post('/api/workers')
    .set('Authorization', `Bearer ${workerToken}`)
    .send({
      skills: ['Plumber'],
      location: 'Raipur',
      priceRange: { min: 200, max: 500 },
    });

  workerProfileId = profileRes.body.data._id;
});

const validBooking = {
  workerId: '', // set in tests
  service: 'Plumbing',
  timeSlot: {
    start: '2027-05-01T10:00:00Z',
    end: '2027-05-01T12:00:00Z',
  },
};

describe('Booking API', () => {
  describe('POST /api/bookings', () => {
    it('should create a booking successfully', async () => {
      const booking = { ...validBooking, workerId: workerProfileId };

      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(booking)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('PENDING');
      expect(res.body.data.service).toBe(booking.service);
    });

    it('should fail with invalid timeSlot (start >= end)', async () => {
      const booking = {
        ...validBooking,
        workerId: workerProfileId,
        timeSlot: { start: '2027-05-01T12:00:00Z', end: '2027-05-01T10:00:00Z' },
      };

      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(booking)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('before');
    });

    it('should fail with duplicate booking', async () => {
      const booking = { ...validBooking, workerId: workerProfileId };

      await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(booking)
        .expect(201);

      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(booking)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Duplicate');
    });
  });

  describe('PATCH /api/bookings/:id/accept', () => {
    it('should accept a booking', async () => {
      const booking = { ...validBooking, workerId: workerProfileId };

      const createRes = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(booking)
        .expect(201);

      const bookingId = createRes.body.data._id;

      const res = await request(app)
        .patch(`/api/bookings/${bookingId}/accept`)
        .set('Authorization', `Bearer ${workerToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('CONFIRMED');
    });

    it('should fail on overlapping booking', async () => {
      const booking1 = {
        ...validBooking,
        workerId: workerProfileId,
        timeSlot: { start: '2027-06-01T08:00:00Z', end: '2027-06-01T10:00:00Z' },
      };
      const booking2 = {
        ...validBooking,
        workerId: workerProfileId,
        timeSlot: { start: '2027-06-01T09:00:00Z', end: '2027-06-01T11:00:00Z' },
      };

      // Create and accept booking1
      const res1 = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(booking1);

      await request(app)
        .patch(`/api/bookings/${res1.body.data._id}/accept`)
        .set('Authorization', `Bearer ${workerToken}`);

      // Create booking2 (overlapping) — should create as PENDING
      const res2 = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(booking2)
        .expect(201);

      // Try to accept booking2 — should fail due to overlap
      const acceptRes = await request(app)
        .patch(`/api/bookings/${res2.body.data._id}/accept`)
        .set('Authorization', `Bearer ${workerToken}`)
        .expect(400);

      expect(acceptRes.body.success).toBe(false);
      expect(acceptRes.body.error).toContain('conflicts');
    });
  });

  describe('PATCH /api/bookings/:id/complete', () => {
    it('should complete a confirmed booking', async () => {
      const booking = { ...validBooking, workerId: workerProfileId };

      const createRes = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(booking);

      const bookingId = createRes.body.data._id;

      // Accept first
      await request(app)
        .patch(`/api/bookings/${bookingId}/accept`)
        .set('Authorization', `Bearer ${workerToken}`);

      // Then complete
      const res = await request(app)
        .patch(`/api/bookings/${bookingId}/complete`)
        .set('Authorization', `Bearer ${workerToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('COMPLETED');
    });
  });

  describe('PATCH /api/bookings/:id/cancel', () => {
    it('should cancel a pending booking', async () => {
      const booking = { ...validBooking, workerId: workerProfileId };

      const createRes = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(booking);

      const bookingId = createRes.body.data._id;

      const res = await request(app)
        .patch(`/api/bookings/${bookingId}/cancel`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ cancelReason: 'Not needed' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('CANCELLED');
      expect(res.body.data.cancelReason).toBe('Not needed');
    });
  });
});

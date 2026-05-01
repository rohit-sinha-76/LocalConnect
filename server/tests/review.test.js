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

// Helper: create a completed booking
async function createCompletedBooking() {
  const bookingRes = await request(app)
    .post('/api/bookings')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({
      workerId: workerProfileId,
      service: 'Test Service',
      timeSlot: { start: '2027-07-01T10:00:00Z', end: '2027-07-01T12:00:00Z' },
    });

  const bookingId = bookingRes.body.data._id;

  // Accept
  await request(app)
    .patch(`/api/bookings/${bookingId}/accept`)
    .set('Authorization', `Bearer ${workerToken}`);

  // Complete
  await request(app)
    .patch(`/api/bookings/${bookingId}/complete`)
    .set('Authorization', `Bearer ${workerToken}`);

  return bookingId;
}

describe('Review API', () => {
  describe('POST /api/reviews', () => {
    it('should create a review for a completed booking', async () => {
      const bookingId = await createCompletedBooking();

      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ bookingId, rating: 5, comment: 'Excellent service' })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.rating).toBe(5);
      expect(res.body.data.comment).toBe('Excellent service');
    });

    it('should fail to review before completion', async () => {
      // Create a PENDING booking (don't accept/complete)
      const bookingRes = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          workerId: workerProfileId,
          service: 'Pending Service',
          timeSlot: { start: '2027-08-01T10:00:00Z', end: '2027-08-01T12:00:00Z' },
        });

      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ bookingId: bookingRes.body.data._id, rating: 4, comment: 'Too early' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('completed');
    });

    it('should fail with duplicate review', async () => {
      const bookingId = await createCompletedBooking();

      // First review
      await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ bookingId, rating: 5, comment: 'First review' })
        .expect(201);

      // Duplicate attempt
      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ bookingId, rating: 4, comment: 'Duplicate' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('already been reviewed');
    });

    it('should update worker rating after review', async () => {
      const bookingId = await createCompletedBooking();

      await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ bookingId, rating: 4, comment: 'Good service' });

      // Fetch worker profile
      const workerRes = await request(app).get(`/api/workers/${workerProfileId}`);

      expect(workerRes.body.data.totalReviews).toBe(1);
      expect(workerRes.body.data.totalRatingSum).toBe(4);
      expect(workerRes.body.data.rating).toBe(4);
    });
  });

  describe('GET /api/reviews/worker/:workerId', () => {
    it('should fetch worker reviews', async () => {
      const bookingId = await createCompletedBooking();

      await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ bookingId, rating: 5, comment: 'Great' });

      const res = await request(app)
        .get(`/api/reviews/worker/${workerProfileId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].rating).toBe(5);
    });
  });
});

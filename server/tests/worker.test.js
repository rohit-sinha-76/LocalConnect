const request = require('supertest');
const { app } = require('../server');
const { connectTestDB, disconnectTestDB, clearCollections } = require('./setup');

let workerToken;

beforeAll(async () => {
  await connectTestDB();

  // Create a worker user and login
  await request(app).post('/api/auth/register').send({
    name: 'Test Worker',
    email: 'worker@test.com',
    password: 'password123',
    role: 'worker',
  });

  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'worker@test.com',
    password: 'password123',
  });

  workerToken = loginRes.body.data.token;
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await clearCollections();

  // Re-create worker user and login after clearing
  await request(app).post('/api/auth/register').send({
    name: 'Test Worker',
    email: 'worker@test.com',
    password: 'password123',
    role: 'worker',
  });

  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'worker@test.com',
    password: 'password123',
  });

  workerToken = loginRes.body.data.token;
});

const validWorkerProfile = {
  skills: ['Plumber', 'Electrician'],
  location: 'Raipur',
  priceRange: { min: 200, max: 500 },
};

describe('Worker API', () => {
  describe('POST /api/workers', () => {
    it('should create a worker profile successfully', async () => {
      const res = await request(app)
        .post('/api/workers')
        .set('Authorization', `Bearer ${workerToken}`)
        .send(validWorkerProfile)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.skills).toEqual(validWorkerProfile.skills);
      expect(res.body.data.location).toBe(validWorkerProfile.location);
      expect(res.body.data.priceRange.min).toBe(validWorkerProfile.priceRange.min);
    });

    it('should fail with duplicate profile', async () => {
      await request(app)
        .post('/api/workers')
        .set('Authorization', `Bearer ${workerToken}`)
        .send(validWorkerProfile)
        .expect(201);

      const res = await request(app)
        .post('/api/workers')
        .set('Authorization', `Bearer ${workerToken}`)
        .send(validWorkerProfile)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('already exists');
    });

    it('should fail with empty skills', async () => {
      const res = await request(app)
        .post('/api/workers')
        .set('Authorization', `Bearer ${workerToken}`)
        .send({ skills: [], location: 'Raipur', priceRange: { min: 100, max: 300 } })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('skill');
    });

    it('should fail without auth token', async () => {
      const res = await request(app)
        .post('/api/workers')
        .send(validWorkerProfile)
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/workers', () => {
    it('should fetch workers with pagination', async () => {
      // Create a worker profile first
      await request(app)
        .post('/api/workers')
        .set('Authorization', `Bearer ${workerToken}`)
        .send(validWorkerProfile);

      const res = await request(app)
        .get('/api/workers?page=1&limit=10')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.workers).toBeDefined();
      expect(res.body.data.pagination).toBeDefined();
      expect(res.body.data.pagination.page).toBe(1);
      expect(res.body.data.pagination.limit).toBe(10);
    });
  });
});

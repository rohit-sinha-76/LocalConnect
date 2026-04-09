const request = require('supertest');
const { app } = require('../server');
const { connectTestDB, disconnectTestDB, clearCollections } = require('./setup');

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await clearCollections();
});

describe('Auth API', () => {
  const validUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'customer',
  };

  describe('POST /api/auth/register', () => {
    it('should register a user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.name).toBe(validUser.name);
      expect(res.body.data.user.email).toBe(validUser.email.toLowerCase());
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.password).toBeUndefined();
    });

    it('should fail with duplicate email', async () => {
      await request(app).post('/api/auth/register').send(validUser).expect(201);

      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('already exists');
    });

    it('should fail with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Incomplete' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('required');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      await request(app).post('/api/auth/register').send(validUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: validUser.password })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(validUser.email.toLowerCase());
    });

    it('should fail with wrong password', async () => {
      await request(app).post('/api/auth/register').send(validUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: 'wrongpassword' })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Invalid credentials');
    });

    it('should fail with non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@example.com', password: 'password123' })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Invalid credentials');
    });
  });
});

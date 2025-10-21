const request = require('supertest');
const app = require('../src/server');

describe('Abstract XP Tracker API', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);

      expect(res.body.status).toBe('OK');
      expect(res.body.timestamp).toBeDefined();
      expect(res.body.uptime).toBeDefined();
    });
  });

  describe('Authentication', () => {
    it('should handle login with wallet address', async () => {
      const mockWalletData = {
        walletAddress: '0x1234567890123456789012345678901234567890',
        signature: 'mock-signature',
        message: 'test message'
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(mockWalletData)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
    });

    it('should reject login without required fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('required');
    });
  });

  describe('XP Data', () => {
    it('should return XP data for user', async () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';
      
      const res = await request(app)
        .get(`/api/xp/user/${walletAddress}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.walletAddress).toBe(walletAddress);
      expect(res.body.data.totalXP).toBeDefined();
    });
  });

  describe('Leaderboard', () => {
    it('should return global leaderboard', async () => {
      const res = await request(app)
        .get('/api/leaderboard/global')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.leaderboard).toBeDefined();
      expect(Array.isArray(res.body.data.leaderboard)).toBe(true);
    });
  });
});

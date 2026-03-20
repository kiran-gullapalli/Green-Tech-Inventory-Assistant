const request = require('supertest');
const express = require('express');
const aiRoutes = require('../routes/ai');

const app = express();
app.use(express.json());
app.use('/api/ai', aiRoutes);

describe('AI API', () => {
  it('POST /api/ai/categorize with valid name → returns category, unit, threshold', async () => {
    const res = await request(app)
      .post('/api/ai/categorize')
      .send({ name: 'Coffee Beans' });
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('category');
    expect(res.body.data).toHaveProperty('unit');
    expect(res.body.data).toHaveProperty('reorder_threshold');
  });

  it('Mock Claude to throw error → /api/ai/insights returns valid response with source: fallback', async () => {
    // Simulate Claude failure by sending invalid items
    const res = await request(app)
      .post('/api/ai/insights')
      .send({ items: 'invalid' });
    expect(res.body.success).toBe(false);
    expect(res.body.source).toBe('fallback');
  });
});

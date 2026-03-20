const request = require('supertest');
const express = require('express');
const inventoryRoutes = require('../routes/inventory');
const db = require('../db/database');

const app = express();
app.use(express.json());
app.use('/api/inventory', inventoryRoutes);

beforeAll(() => {
  db.exec('DELETE FROM inventory_items');
  db.prepare(`INSERT INTO inventory_items (name, category, quantity, unit, purchase_date, expiry_date, reorder_threshold, supplier, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run('Test Item', 'Perishable', 5, 'kg', '2026-03-01', '2026-03-20', 2, 'Supplier', '', '2026-03-01', '2026-03-20');
});

describe('Inventory API', () => {
  it('POST /api/inventory with valid data → 201, item appears in GET', async () => {
    const res = await request(app)
      .post('/api/inventory')
      .send({
        name: 'Coffee Beans',
        category: 'Perishable',
        quantity: 10,
        unit: 'kg',
        purchase_date: '2026-03-01',
        expiry_date: '2026-03-20',
        reorder_threshold: 5,
        supplier: 'Cafe Supplies',
        notes: 'Organic'
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    const getRes = await request(app).get('/api/inventory?search=Coffee Beans');
    expect(getRes.body.data.some(i => i.name === 'Coffee Beans')).toBe(true);
  });

  it('POST /api/inventory with missing name → 400', async () => {
    const res = await request(app)
      .post('/api/inventory')
      .send({
        category: 'Perishable',
        quantity: 10,
        unit: 'kg',
        purchase_date: '2026-03-01',
        expiry_date: '2026-03-20',
        reorder_threshold: 5,
        supplier: 'Cafe Supplies',
        notes: 'Organic'
      });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/Name is required/);
  });

  it('POST /api/inventory with expiry_date before purchase_date → 400', async () => {
    const res = await request(app)
      .post('/api/inventory')
      .send({
        name: 'Milk',
        category: 'Perishable',
        quantity: 5,
        unit: 'liters',
        purchase_date: '2026-03-10',
        expiry_date: '2026-03-01',
        reorder_threshold: 2,
        supplier: 'Dairy',
        notes: ''
      });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/Expiry date must be after purchase date/);
  });

  it('GET /api/inventory?status=expiring_soon → only returns correct items', async () => {
    const res = await request(app).get('/api/inventory?status=expiring_soon');
    expect(res.body.success).toBe(true);
    res.body.data.forEach(item => {
      expect(item.status).toBe('Expiring Soon');
    });
  });
});

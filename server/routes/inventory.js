const express = require('express');
const db = require('../db/database');
const router = express.Router();

// Helper: compute status
function computeStatus(item) {
  const now = new Date();
  let status = 'OK';
  if (item.expiry_date) {
    const expiry = new Date(item.expiry_date);
    if (expiry < now) status = 'Expired';
    else if ((expiry - now) / (1000 * 60 * 60 * 24) <= 7) status = 'Expiring Soon';
  }
  if (item.quantity <= item.reorder_threshold) status = 'Low Stock';
  if (status === 'Expired') return 'Expired';
  if (status === 'Expiring Soon') return 'Expiring Soon';
  if (status === 'Low Stock') return 'Low Stock';
  return 'OK';
}

// GET /api/inventory
router.get('/', (req, res) => {
  let { search, category, status } = req.query;
  let sql = 'SELECT * FROM inventory_items';
  let conditions = [];
  let params = [];

  if (search) {
    conditions.push('name LIKE ?');
    params.push(`%${search}%`);
  }
  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }

  if (conditions.length) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  const items = db.prepare(sql).all(...params);
  const itemsWithStatus = items.map(item => ({ ...item, status: computeStatus(item) }));

  if (status) {
    let filterStatus = status.toLowerCase();
    const filtered = itemsWithStatus.filter(item => {
      if (filterStatus === 'expiring_soon') return item.status === 'Expiring Soon';
      if (filterStatus === 'expired') return item.status === 'Expired';
      if (filterStatus === 'low_stock') return item.status === 'Low Stock';
      if (filterStatus === 'ok') return item.status === 'OK';
      return true;
    });
    return res.json({ success: true, data: filtered, error: null });
  }

  res.json({ success: true, data: itemsWithStatus, error: null });
});

// GET /api/inventory/:id
router.get('/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ success: false, data: null, error: 'Item not found' });
  item.status = computeStatus(item);
  res.json({ success: true, data: item, error: null });
});

// POST /api/inventory
router.post('/', (req, res) => {
  const {
    name, category, quantity, unit, purchase_date, expiry_date,
    reorder_threshold, supplier, notes
  } = req.body;

  // Validation
  if (!name || typeof name !== 'string' || name.length < 2) {
    return res.status(400).json({ success: false, data: null, error: 'Name is required, min 2 chars' });
  }
  if (quantity == null || isNaN(quantity) || Number(quantity) <= 0) {
    return res.status(400).json({ success: false, data: null, error: 'Quantity must be a positive number' });
  }
  if (reorder_threshold != null && (isNaN(reorder_threshold) || Number(reorder_threshold) <= 0)) {
    return res.status(400).json({ success: false, data: null, error: 'Reorder threshold must be positive if provided' });
  }
  if (expiry_date && purchase_date && new Date(expiry_date) < new Date(purchase_date)) {
    return res.status(400).json({ success: false, data: null, error: 'Expiry date must be after purchase date' });
  }

  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO inventory_items (
      name, category, quantity, unit, purchase_date, expiry_date, reorder_threshold, supplier, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    name, category, quantity, unit, purchase_date, expiry_date,
    reorder_threshold, supplier, notes, now, now
  );
  const item = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(info.lastInsertRowid);
  item.status = computeStatus(item);
  res.status(201).json({ success: true, data: item, error: null });
});

// PUT /api/inventory/:id
router.put('/:id', (req, res) => {
  const {
    name, category, quantity, unit, purchase_date, expiry_date,
    reorder_threshold, supplier, notes
  } = req.body;

  const item = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ success: false, data: null, error: 'Item not found' });

  // Validation
  if (!name || typeof name !== 'string' || name.length < 2) {
    return res.status(400).json({ success: false, data: null, error: 'Name is required, min 2 chars' });
  }
  if (quantity == null || isNaN(quantity) || Number(quantity) <= 0) {
    return res.status(400).json({ success: false, data: null, error: 'Quantity must be a positive number' });
  }
  if (reorder_threshold != null && (isNaN(reorder_threshold) || Number(reorder_threshold) <= 0)) {
    return res.status(400).json({ success: false, data: null, error: 'Reorder threshold must be positive if provided' });
  }
  if (expiry_date && purchase_date && new Date(expiry_date) < new Date(purchase_date)) {
    return res.status(400).json({ success: false, data: null, error: 'Expiry date must be after purchase date' });
  }

  const now = new Date().toISOString();
  const stmt = db.prepare(`
    UPDATE inventory_items SET
      name = ?, category = ?, quantity = ?, unit = ?, purchase_date = ?, expiry_date = ?,
      reorder_threshold = ?, supplier = ?, notes = ?, updated_at = ?
    WHERE id = ?
  `);
  stmt.run(
    name, category, quantity, unit, purchase_date, expiry_date,
    reorder_threshold, supplier, notes, now, req.params.id
  );
  const updated = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(req.params.id);
  updated.status = computeStatus(updated);
  res.json({ success: true, data: updated, error: null });
});

// DELETE /api/inventory/:id
router.delete('/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ success: false, data: null, error: 'Item not found' });
  db.prepare('DELETE FROM inventory_items WHERE id = ?').run(req.params.id);
  res.json({ success: true, data: null, error: null });
});

module.exports = router;

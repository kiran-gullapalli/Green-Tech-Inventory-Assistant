const db = require('./database');
const fs = require('fs');
const path = require('path');

const sampleDataPath = path.join(__dirname, '../data/sample_inventory.json');
const items = JSON.parse(fs.readFileSync(sampleDataPath, 'utf8'));

const insert = db.prepare(`
  INSERT INTO inventory_items (
    name, category, quantity, unit, purchase_date, expiry_date, reorder_threshold, supplier, notes, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

db.exec('DELETE FROM inventory_items'); // Clear table before seeding

items.forEach(item => {
  insert.run(
    item.name,
    item.category,
    item.quantity,
    item.unit,
    item.purchase_date,
    item.expiry_date,
    item.reorder_threshold,
    item.supplier,
    item.notes,
    item.created_at,
    item.updated_at
  );
});

console.log(`Seeded ${items.length} inventory items.`);

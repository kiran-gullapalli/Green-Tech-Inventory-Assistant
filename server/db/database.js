const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'inventory.db');
const db = new Database(dbPath);

// Create inventory_items table if it doesn't exist
const createTable = `
CREATE TABLE IF NOT EXISTS inventory_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT,
  quantity REAL NOT NULL,
  unit TEXT,
  purchase_date TEXT,
  expiry_date TEXT,
  reorder_threshold REAL,
  supplier TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
`;
db.exec(createTable);

module.exports = db;

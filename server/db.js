import sqlite3 from "sqlite3";

export const db = new sqlite3.Database("./store.db");

export function initDb() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        emoji TEXT NOT NULL,
        description TEXT NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        image_url TEXT DEFAULT '',
        created_at TEXT NOT NULL
      )
    `);

    db.all(`PRAGMA table_info(products)`, (err, cols) => {
      if (err) return;
      const hasImage = cols.some((c) => c.name === "image_url");
      if (!hasImage) db.run(`ALTER TABLE products ADD COLUMN image_url TEXT DEFAULT ''`);
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        notes TEXT,
        items_json TEXT NOT NULL,
        subtotal REAL NOT NULL,
        shipping REAL NOT NULL,
        total REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'NEW',
        created_at TEXT NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);

    db.get("SELECT COUNT(*) as c FROM products", (err, row) => {
      if (err) return;
      if (row.c === 0) {
        const now = new Date().toISOString();
        const stmt = db.prepare(`
          INSERT INTO products (name, price, category, emoji, description, stock, image_url, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const seed = [
          [
            "Ergonomic Memory Foam Neck Pillow",
            49.99,
            "Sleep Essentials",
            "Pillow",
            "Contour support that helps improve sleep posture and comfort.",
            25,
            "/images/products/neck-pillow-main.jpg",
            now
          ],
          [
            "Premium Sleep Mask",
            19.99,
            "Sleep Essentials",
            "Mask",
            "Soft light-blocking mask for uninterrupted rest.",
            40,
            "/images/products/sleep-mask-main.jpg",
            now
          ],
          [
            "White Noise Machine",
            39.99,
            "Sleep Essentials",
            "Noise",
            "Calming sound profiles to support deeper sleep.",
            30,
            "/images/products/white-noise-main.jpg",
            now
          ]
        ];

        for (const product of seed) stmt.run(product);
        stmt.finalize();
      }
    });
  });
}

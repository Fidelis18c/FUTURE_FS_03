const db = require('./config/db');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    console.log('Seeding database...');
    
    // 1. Create Category
    const catResult = await db.query(
      "INSERT INTO categories (name, slug) VALUES ('Electronics', 'electronics') ON CONFLICT DO NOTHING RETURNING id"
    );
    const catId = catResult.rows[0]?.id;

    if (catId) {
      // 2. Create Product
      const prodResult = await db.query(
        "INSERT INTO products (category_id, name, slug, description, price, sku) VALUES ($1, 'Laptop Pro', 'laptop-pro', 'High performance laptop', 1200.00, 'LP-001') ON CONFLICT DO NOTHING RETURNING id",
        [catId]
      );
      const prodId = prodResult.rows[0]?.id;

      if (prodId) {
        // 3. Create Inventory
        await db.query(
          "INSERT INTO inventory (product_id, available) VALUES ($1, 50) ON CONFLICT DO NOTHING",
          [prodId]
        );
      }
    }

    // 4. Create Admin User
    const hashedPass = await bcrypt.hash('admin123', 10);
    await db.query(
      "INSERT INTO users (email, phone_number, password_hash, full_name, role) VALUES ('admin@example.com', '0123456789', $1, 'Admin User', 'admin') ON CONFLICT DO NOTHING",
      [hashedPass]
    );

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();

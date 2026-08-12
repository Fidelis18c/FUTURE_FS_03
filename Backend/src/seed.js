const fs = require('fs');
const path = require('path');
const db = require('./config/db');
const bcrypt = require('bcryptjs');

const loadJsonFile = (filename) => {
  const filePath = path.join(__dirname, '../../Frontend/src/data', filename);
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      if (raw.trim()) return JSON.parse(raw);
    } catch (e) {
      console.warn(`Could not parse ${filename}:`, e.message);
    }
  }
  return [];
};

const getAllProductsData = () => {
  const files = [
    // iphone13.json - iphone17.json intentionally excluded here: those products
    // already exist in the DB under differently-cased/worded slugs, so seeding
    // them would create duplicates instead of updating the existing rows.
    'iphone12.json',
    'iphone11.json',
    'samsung.json',
    'other.json',
    'iphoneother.json',
  ];
  let all = [];
  for (const f of files) {
    const items = loadJsonFile(f);
    if (Array.isArray(items)) {
      all = all.concat(items);
    }
  }
  return all;
};

const seed = async () => {
  try {
    console.log('Starting Database Seeding...');

    const products = getAllProductsData();
    console.log(`Found ${products.length} products to seed.`);

    // 1. Create/Ensure Admin User
    const hashedPass = await bcrypt.hash('admin123', 10);
    await db.query(
      `INSERT INTO users (email, phone_number, password_hash, full_name, role)
       VALUES ('admin@example.com', '0123456789', $1, 'Admin User', 'admin')
       ON CONFLICT (email) DO NOTHING`,
      [hashedPass]
    );

    for (const p of products) {
      if (!p.name || !p.slug) continue;

      // Category Name & Slug
      const categoryName = p.category || 'General';
      const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');

      // A. Upsert Category
      const catResult = await db.query(
        `INSERT INTO categories (name, slug)
         VALUES ($1, $2)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [categoryName, categorySlug]
      );
      const categoryId = catResult.rows[0].id;

      // B. Upsert Product
      const prodResult = await db.query(
        `INSERT INTO products (category_id, name, slug, description, image_url, price)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url, price = EXCLUDED.price
         RETURNING id`,
        [categoryId, p.name, p.slug, p.description || `${p.name} - High quality product.`, p.image || null, parseFloat(p.price) || 0]
      );
      const productId = prodResult.rows[0].id;

      // C. Process Variants
      let variantsToCreate = [];

      if (p.variantData && Object.keys(p.variantData).length > 0) {
        for (const [color, colorData] of Object.entries(p.variantData)) {
          if (colorData.prices && Object.keys(colorData.prices).length > 0) {
            for (const [storage, price] of Object.entries(colorData.prices)) {
              variantsToCreate.push({
                name: `${p.name} - ${color} (${storage})`,
                color,
                storage,
                price: parseFloat(price) || p.price || 0,
                image: colorData.image || p.image || null,
              });
            }
          } else {
            variantsToCreate.push({
              name: `${p.name} - ${color}`,
              color,
              storage: '',
              price: parseFloat(p.price) || 0,
              image: colorData.image || p.image || null,
            });
          }
        }
      } else {
        // Default variant if no variantData exists
        variantsToCreate.push({
          name: `${p.name} - Standard`,
          color: 'Default',
          storage: p.variant || '',
          price: parseFloat(p.price) || 0,
          image: p.image || null,
        });
      }

      // D. Insert or Update Variants and Inventory
      // No unique constraint exists on product_variants beyond its primary key,
      // so upserts are done manually (match by product_id + attributes) instead
      // of relying on ON CONFLICT.
      for (const v of variantsToCreate) {
        const attributes = JSON.stringify({ color: v.color, storage: v.storage });

        const existing = await db.query(
          `SELECT id FROM product_variants WHERE product_id = $1 AND attributes = $2::jsonb`,
          [productId, attributes]
        );

        let variantId;
        if (existing.rows.length > 0) {
          variantId = existing.rows[0].id;
          await db.query(
            `UPDATE product_variants SET name = $1, price = $2, image_url = $3 WHERE id = $4`,
            [v.name, v.price, v.image, variantId]
          );
        } else {
          const inserted = await db.query(
            `INSERT INTO product_variants (product_id, name, attributes, price, image_url)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id`,
            [productId, v.name, attributes, v.price, v.image]
          );
          variantId = inserted.rows[0].id;
        }

        // E. Insert or Update Inventory
        // Same story: inventory.variant_id has no unique constraint to upsert against.
        const existingInventory = await db.query(
          `SELECT variant_id FROM inventory WHERE variant_id = $1`,
          [variantId]
        );
        if (existingInventory.rows.length > 0) {
          await db.query(`UPDATE inventory SET available = 50 WHERE variant_id = $1`, [variantId]);
        } else {
          await db.query(`INSERT INTO inventory (variant_id, available) VALUES ($1, 50)`, [variantId]);
        }
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();

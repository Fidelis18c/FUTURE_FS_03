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
    'iphone17.json',
    'iphone16.json',
    'iphone15.json',
    'iphone14.json',
    'iphone13.json',
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
        `INSERT INTO products (category_id, name, slug, description, image_url)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url
         RETURNING id`,
        [categoryId, p.name, p.slug, p.description || `${p.name} - High quality product.`, p.image || null]
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
                sku: `${p.slug}-${color}-${storage}`.toLowerCase().replace(/[^a-z0-9-]/g, ''),
              });
            }
          } else {
            variantsToCreate.push({
              name: `${p.name} - ${color}`,
              color,
              storage: '',
              price: parseFloat(p.price) || 0,
              image: colorData.image || p.image || null,
              sku: `${p.slug}-${color}`.toLowerCase().replace(/[^a-z0-9-]/g, ''),
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
          sku: `${p.slug}-standard`.toLowerCase().replace(/[^a-z0-9-]/g, ''),
        });
      }

      // D. Insert Variants and Inventory
      for (const v of variantsToCreate) {
        const variantResult = await db.query(
          `INSERT INTO product_variants (product_id, name, attributes, price, sku, image_url)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price, name = EXCLUDED.name, image_url = EXCLUDED.image_url
           RETURNING id`,
          [
            productId,
            v.name,
            JSON.stringify({ color: v.color, storage: v.storage }),
            v.price,
            v.sku,
            v.image,
          ]
        );

        const variantId = variantResult.rows[0].id;

        // E. Insert Inventory
        await db.query(
          `INSERT INTO inventory (variant_id, available)
           VALUES ($1, 50)
           ON CONFLICT (variant_id) DO UPDATE SET available = EXCLUDED.available`,
          [variantId]
        );
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

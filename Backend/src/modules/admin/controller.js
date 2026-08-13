const db = require('../../config/db');
const crypto = require('crypto');
const supabase = require('../../config/supabase');

const IMAGE_BUCKET = 'product-images';

const slugify = (str) =>
  str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Postgres foreign_key_violation — e.g. deleting a product/variant that a
// real order references. Surfaced as a clear 409 instead of a raw 500.
const isFkViolation = (err) => err.code === '23503';

// ---------- Products ----------

const getAdminProducts = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT p.id, p.name, p.slug, p.description, p.category_id, p.image_url, p.price, c.name as category_name,
      COALESCE(
        (
          SELECT json_agg(json_build_object(
            'id', v.id, 'name', v.name, 'attributes', v.attributes,
            'price', v.price, 'image_url', v.image_url,
            'available', COALESCE(i.available, 0)
          ) ORDER BY v.name)
          FROM product_variants v
          LEFT JOIN inventory i ON v.id = i.variant_id
          WHERE v.product_id = p.id
        ), '[]'::json
      ) as variants
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.name ASC
    `);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const getAdminProductById = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT p.*, c.name as category_name,
      COALESCE(
        (
          SELECT json_agg(json_build_object(
            'id', v.id, 'name', v.name, 'attributes', v.attributes,
            'price', v.price, 'image_url', v.image_url,
            'available', COALESCE(i.available, 0)
          ) ORDER BY v.name)
          FROM product_variants v
          LEFT JOIN inventory i ON v.id = i.variant_id
          WHERE v.product_id = p.id
        ), '[]'::json
      ) as variants
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  const { name, category_id, description, image_url, price, variants } = req.body;
  let { slug } = req.body;

  if (!name || !category_id || price === undefined || price === null) {
    return res.status(400).json({ error: 'name, category_id and price are required' });
  }
  if (variants && !Array.isArray(variants)) {
    return res.status(400).json({ error: 'variants must be an array' });
  }

  try {
    slug = slugify(slug || name);

    const prodResult = await db.query(
      `INSERT INTO products (category_id, name, slug, description, image_url, price)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [category_id, name, slug, description || null, image_url || null, price]
    );
    const product = prodResult.rows[0];

    const createdVariants = [];
    for (const v of variants || []) {
      if (v.price === undefined || v.price === null) {
        return res.status(400).json({ error: 'Each variant requires a price' });
      }
      const attributes = JSON.stringify({ color: v.color || '', storage: v.storage || '' });
      const variantName = v.name || `${name}${v.color ? ` - ${v.color}` : ''}${v.storage ? ` (${v.storage})` : ''}`;

      const variantResult = await db.query(
        `INSERT INTO product_variants (product_id, name, attributes, price, image_url)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [product.id, variantName, attributes, v.price, v.image_url || image_url || null]
      );
      const variant = variantResult.rows[0];

      await db.query(
        `INSERT INTO inventory (variant_id, available) VALUES ($1, $2)`,
        [variant.id, v.available ?? 0]
      );
      createdVariants.push({ ...variant, available: v.available ?? 0 });
    }

    res.status(201).json({ ...product, variants: createdVariants });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'A product with that slug already exists' });
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, image_url, price, category_id, slug } = req.body;

  const fields = [];
  const params = [];
  const set = (col, val) => { params.push(val); fields.push(`${col} = $${params.length}`); };

  if (name !== undefined) set('name', name);
  if (description !== undefined) set('description', description);
  if (image_url !== undefined) set('image_url', image_url);
  if (price !== undefined) set('price', price);
  if (category_id !== undefined) set('category_id', category_id);
  if (slug !== undefined) set('slug', slugify(slug));

  if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

  params.push(id);
  try {
    const result = await db.query(
      `UPDATE products SET ${fields.join(', ')} WHERE id = $${params.length} RETURNING *`,
      params
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'A product with that slug already exists' });
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.status(204).send();
  } catch (err) {
    if (isFkViolation(err)) {
      return res.status(409).json({ error: 'Cannot delete — this product has existing orders. Remove or reassign those first.' });
    }
    next(err);
  }
};

// ---------- Variants ----------

const addVariant = async (req, res, next) => {
  const { id: product_id } = req.params;
  const { color, storage, price, image_url, available } = req.body;

  if (price === undefined || price === null) {
    return res.status(400).json({ error: 'price is required' });
  }

  try {
    const product = await db.query('SELECT name, image_url FROM products WHERE id = $1', [product_id]);
    if (product.rows.length === 0) return res.status(404).json({ error: 'Product not found' });

    const attributes = JSON.stringify({ color: color || '', storage: storage || '' });
    const variantName = `${product.rows[0].name}${color ? ` - ${color}` : ''}${storage ? ` (${storage})` : ''}`;

    const variantResult = await db.query(
      `INSERT INTO product_variants (product_id, name, attributes, price, image_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [product_id, variantName, attributes, price, image_url || product.rows[0].image_url || null]
    );
    const variant = variantResult.rows[0];

    await db.query(`INSERT INTO inventory (variant_id, available) VALUES ($1, $2)`, [variant.id, available ?? 0]);
    res.status(201).json({ ...variant, available: available ?? 0 });
  } catch (err) {
    next(err);
  }
};

const updateVariant = async (req, res, next) => {
  const { id } = req.params;
  const { color, storage, price, image_url, available } = req.body;

  const fields = [];
  const params = [];
  const set = (col, val) => { params.push(val); fields.push(`${col} = $${params.length}`); };

  if (price !== undefined) set('price', price);
  if (image_url !== undefined) set('image_url', image_url);
  if (color !== undefined || storage !== undefined) {
    const existing = await db.query('SELECT attributes FROM product_variants WHERE id = $1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Variant not found' });
    const attrs = existing.rows[0].attributes || {};
    set('attributes', JSON.stringify({
      color: color !== undefined ? color : attrs.color || '',
      storage: storage !== undefined ? storage : attrs.storage || '',
    }));
  }

  try {
    if (fields.length > 0) {
      params.push(id);
      const result = await db.query(
        `UPDATE product_variants SET ${fields.join(', ')} WHERE id = $${params.length} RETURNING id`,
        params
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Variant not found' });
    }

    if (available !== undefined) {
      const invResult = await db.query('UPDATE inventory SET available = $1 WHERE variant_id = $2 RETURNING variant_id', [available, id]);
      if (invResult.rows.length === 0) {
        await db.query('INSERT INTO inventory (variant_id, available) VALUES ($1, $2)', [id, available]);
      }
    }

    const full = await db.query(`
      SELECT v.*, COALESCE(i.available, 0) as available
      FROM product_variants v LEFT JOIN inventory i ON v.id = i.variant_id
      WHERE v.id = $1
    `, [id]);
    if (full.rows.length === 0) return res.status(404).json({ error: 'Variant not found' });
    res.json(full.rows[0]);
  } catch (err) {
    next(err);
  }
};

const deleteVariant = async (req, res, next) => {
  try {
    const result = await db.query('DELETE FROM product_variants WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Variant not found' });
    res.status(204).send();
  } catch (err) {
    if (isFkViolation(err)) {
      return res.status(409).json({ error: 'Cannot delete — this variant has existing orders. Remove or reassign those first.' });
    }
    next(err);
  }
};

// ---------- Categories ----------

const createCategory = async (req, res, next) => {
  const { name } = req.body;
  let { slug } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });

  try {
    slug = slugify(slug || name);
    const result = await db.query(
      'INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *',
      [name, slug]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'A category with that slug already exists' });
    next(err);
  }
};

// ---------- Image upload ----------

const uploadImage = async (req, res, next) => {
  if (!req.file) return res.status(400).json({ error: 'No image file provided (field name: image)' });

  try {
    const ext = (req.file.originalname.split('.').pop() || 'jpg').toLowerCase();
    const path = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, req.file.buffer, { contentType: req.file.mimetype });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
    res.status(201).json({ url: data.publicUrl });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadImage,
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addVariant,
  updateVariant,
  deleteVariant,
  createCategory,
};

const db = require('../../../config/db');
const { slugify, isFkViolation } = require('../utils');

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

module.exports = { getAdminProducts, getAdminProductById, createProduct, updateProduct, deleteProduct };

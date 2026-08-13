const db = require('../../../config/db');
const { isFkViolation } = require('../utils');

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

module.exports = { addVariant, updateVariant, deleteVariant };

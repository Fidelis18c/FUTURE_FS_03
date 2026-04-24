const db = require('../../config/db');

const getAllProducts = async (req, res, next) => {
  const { category, search, limit = 20, offset = 0 } = req.query;
  try {
    let query = `
      SELECT p.*, c.name as category_name, 
      (
        SELECT json_agg(v.*) 
        FROM product_variants v 
        LEFT JOIN inventory i ON v.id = i.variant_id
        WHERE v.product_id = p.id
      ) as variants
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND c.slug = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`;
    }

    params.push(parseInt(limit), parseInt(offset));
    query += ` ORDER BY p.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const getProductBySlug = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const query = `
      SELECT p.*, c.name as category_name, 
      (
        SELECT json_agg(json_build_object(
          'id', v.id,
          'name', v.name,
          'attributes', v.attributes,
          'price', v.price,
          'sku', v.sku,
          'available', i.available
        ))
        FROM product_variants v 
        LEFT JOIN inventory i ON v.id = i.variant_id
        WHERE v.product_id = p.id
      ) as variants
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = $1
    `;
    const result = await db.query(query, [slug]);
    
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllProducts, getProductBySlug };

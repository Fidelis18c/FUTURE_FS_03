const db = require('../../config/db');

const getAllProducts = async (req, res, next) => {
  // 1. Sanitize and validate pagination
  let limit = parseInt(req.query.limit) || 20;
  let offset = parseInt(req.query.offset) || 0;
  const category = req.query.category;
  const search = req.query.search;

  // Prevent abuse and invalid values
  if (limit > 100) limit = 100;
  if (limit < 1) limit = 20;
  if (offset < 0) offset = 0;

  try {
    let query = `
      SELECT p.id, p.name, p.slug, p.description, p.category_id, p.created_at, c.name as category_name, 
      COALESCE(
        (
          SELECT json_agg(json_build_object(
            'id', v.id,
            'name', v.name,
            'attributes', v.attributes,
            'price', v.price,
            'available', COALESCE(i.available, 0)
          ))
          FROM product_variants v 
          LEFT JOIN inventory i ON v.id = i.variant_id
          WHERE v.product_id = p.id
        ), 
        '[]'::json
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

    params.push(limit, offset);
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

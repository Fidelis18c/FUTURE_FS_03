const db = require('../../config/db');

const getAllProducts = async (req, res, next) => {
  const { category, search, limit = 20, offset = 0 } = req.query;
  try {
    let query = `
      SELECT p.*, c.name as category_name, i.available 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN inventory i ON p.id = i.product_id
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
    const result = await db.query(
      'SELECT p.*, c.name as category_name, i.available FROM products p LEFT JOIN categories c ON p.category_id = c.id LEFT JOIN inventory i ON p.id = i.product_id WHERE p.slug = $1',
      [slug]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllProducts, getProductBySlug };

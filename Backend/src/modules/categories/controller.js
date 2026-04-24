const db = require('../../config/db');

const getAllCategories = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const getCategoryBySlug = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const result = await db.query('SELECT * FROM categories WHERE slug = $1', [slug]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Category not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllCategories, getCategoryBySlug };

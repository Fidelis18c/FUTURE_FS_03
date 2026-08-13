const db = require('../../../config/db');
const { slugify } = require('../utils');

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

module.exports = { createCategory };

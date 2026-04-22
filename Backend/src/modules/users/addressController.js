const db = require('../../config/db');

const addAddress = async (req, res, next) => {
  const { full_name, phone_number, region, city, street, is_default } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO addresses (user_id, full_name, phone_number, region, city, street, is_default) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.id, full_name, phone_number, region, city, street, is_default || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const getMyAddresses = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM addresses WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { addAddress, getMyAddresses };

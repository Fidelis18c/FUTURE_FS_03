const db = require('../../config/db');

const addToCart = async (req, res, next) => {
  const { variant_id, quantity } = req.body;
  const userId = req.user.id;

  try {
    // 1. Verify stock availability
    const stockCheck = await db.query(
      'SELECT available FROM inventory WHERE variant_id = $1',
      [variant_id]
    );

    if (stockCheck.rows.length === 0 || stockCheck.rows[0].available < quantity) {
      return res.status(400).json({ error: 'Insufficient stock available' });
    }

    // 2. Add or update cart item
    const result = await db.query(
      `INSERT INTO cart_items (user_id, variant_id, quantity) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (user_id, variant_id) 
       DO UPDATE SET quantity = cart_items.quantity + $3
       RETURNING *`,
      [userId, variant_id, quantity]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const getMyCart = async (req, res, next) => {
  try {
    const query = `
      SELECT ci.*, v.name as variant_name, v.price, v.attributes, p.name as product_name
      FROM cart_items ci
      JOIN product_variants v ON ci.variant_id = v.id
      JOIN products p ON v.product_id = p.id
      WHERE ci.user_id = $1
    `;
    const result = await db.query(query, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const updateCartItem = async (req, res, next) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    const result = await db.query(
      'UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [quantity, id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Cart item not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const removeCartItem = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    next(err);
  }
};

module.exports = { addToCart, getMyCart, updateCartItem, removeCartItem };

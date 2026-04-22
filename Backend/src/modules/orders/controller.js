const db = require('../../config/db');
const { reserveStock } = require('../../services/inventoryService');
const { initiatePayment } = require('../../services/zenopayService');

const createOrder = async (req, res, next) => {
  const { address_id, items, payment_phone } = req.body; 
  const userId = req.user.id;

  if (!payment_phone) {
    return res.status(400).json({ error: 'A specific payment phone number is required.' });
  }

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.price * item.quantity;
    }

    // 1. Create Order
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, address_id, total_amount,status) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, address_id, totalAmount, 'pending']
    );
    const orderId = orderResult.rows[0].id;

    // 2. Reserve Stock and Create Order Items
    for (const item of items) {
      await reserveStock(item.productId, item.quantity, client);
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    

    // 3. Initiate Zenopay Payment
    try {
      // Get user details for Zenopay
      const userResult = await client.query('SELECT full_name, email FROM users WHERE id = $1', [userId]);
      const user = userResult.rows[0];

      await initiatePayment({
        orderId: orderId,
        amount: totalAmount,
        buyerName: user.full_name,
        buyerEmail: user.email,
        buyerPhone: payment_phone
      });

      // Record internal payment record
      await client.query(
        'INSERT INTO payments (order_id, amount, payment_method, provider) VALUES ($1, $2, $3, $4)',
        [orderId, totalAmount, 'mobile_money', 'ZENOPAY']
      );
    } catch (payErr) {
     console.error('Zenopay FULL ERROR:', payErr.response?.data || payErr.message);
     throw payErr;
}
    

    await client.query('COMMIT');
    
    res.status(201).json({ 
      orderId, 
      totalAmount, 
      message: 'Order created and stock reserved. Please confirm the payment on your phone.' 
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("ORDER ERROR:", err);
   return res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT o.*, p.status as payment_status FROM orders o LEFT JOIN payments p ON o.id = p.order_id WHERE o.user_id = $1 ORDER BY o.created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, getMyOrders };
 


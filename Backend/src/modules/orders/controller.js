const db = require('../../config/db');
const { reserveStock } = require('../../services/inventoryService');
const { initiatePayment } = require('../../services/zenopayService');
const { sendSMS } = require('../../services/smsService');

const createOrder = async (req, res, next) => {
  const { address_id, payment_phone } = req.body; 
  const userId = req.user.id;

  if (!payment_phone) {
    return res.status(400).json({ error: 'Payment phone number is required.' });
  }

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Fetch Cart Items with current Variant Prices
    const cartResult = await client.query(
      `SELECT ci.*, v.price, v.name as variant_name, p.name as product_name
       FROM cart_items ci
       JOIN product_variants v ON ci.variant_id = v.id
       JOIN products p ON v.product_id = p.id
       WHERE ci.user_id = $1`,
      [userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Your cart is empty.' });
    }

    // 2. Calculate Total and Reserve Stock (Secure Pricing)
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cartResult.rows) {
      const itemTotal = parseFloat(item.price) * item.quantity;
      totalAmount += itemTotal;

      // Reserve stock at variant level
      await reserveStock(item.variant_id, item.quantity, client);

      orderItems.push({
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: item.price
      });
    }

    // 3. Create Order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, address_id, total_amount, status) 
       VALUES ($1, $2, $3, 'pending') RETURNING id`,
      [userId, address_id, totalAmount]
    );
    const orderId = orderResult.rows[0].id;

    // 4. Insert Order Items
    for (const item of orderItems) {
      await client.query(
        'INSERT INTO order_items (order_id, variant_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
        [orderId, item.variant_id, item.quantity, item.unit_price]
      );
    }

    // 5. Clear Cart
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    // 6. Initiate Payment (Zenopay)
    try {
      const userResult = await client.query('SELECT full_name, phone_number FROM users WHERE id = $1', [userId]);
      const user = userResult.rows[0];

      await initiatePayment({
        orderId: orderId,
        amount: totalAmount,
        buyerName: user.full_name,
        buyerEmail: user.email || '',
        buyerPhone: payment_phone
      });

      await client.query(
        'INSERT INTO payments (order_id, amount, payment_method, provider) VALUES ($1, $2, $3, $4)',
        [orderId, totalAmount, 'mobile_money', 'ZENOPAY']
      );

      // Send SMS notification
      await sendSMS(user.phone_number, `Hello ${user.full_name}, your order #${orderId.slice(0,8)} has been received. Please complete the payment of TZS ${totalAmount} on your phone.`);
      
    } catch (payErr) {
      console.error('Payment/SMS background error:', payErr.message);
    }

    await client.query('COMMIT');
    res.status(201).json({ orderId, totalAmount, message: 'Checkout successful. Please confirm payment.' });

  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

const getOrderDetails = async (req, res, next) => {
  const { id } = req.params;
  try {
    const orderQuery = `
      SELECT o.*, 
      (
        SELECT json_agg(json_build_object(
          'id', oi.id,
          'quantity', oi.quantity,
          'unit_price', oi.unit_price,
          'variant_name', v.name,
          'product_name', p.name,
          'attributes', v.attributes
        ))
        FROM order_items oi
        JOIN product_variants v ON oi.variant_id = v.id
        JOIN products p ON v.product_id = p.id
        WHERE oi.order_id = o.id
      ) as items,
      p.status as payment_status,
      p.transaction_id
      FROM orders o
      LEFT JOIN payments p ON o.id = p.order_id
      WHERE o.id = $1 AND o.user_id = $2
    `;
    const result = await db.query(orderQuery, [id, req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, getOrderDetails, getMyOrders };

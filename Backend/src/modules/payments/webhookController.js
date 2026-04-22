const db = require('../../config/db');
const { confirmStockSale } = require('../../services/inventoryService');

const handleZenopayWebhook = async (req, res, next) => {
  const { order_id, transaction_id, status, amount, message } = req.body;
  
  console.log(`Received Zenopay Webhook for Order: ${order_id}, Status: ${status}`);

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Update Payment Record
    const paymentUpdate = await client.query(
      'UPDATE payments SET transaction_id = $1, status = $2 WHERE order_id = $3 RETURNING id',
      [transaction_id, status === 'success' ? 'success' : 'failed', order_id]
    );

    if (paymentUpdate.rows.length === 0) {
      console.warn(`Webhook received for unknown order: ${order_id}`);
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Order not found' });
    }

    if (status === 'success') {
      // 2. Update Order Status
      await client.query(
        "UPDATE orders SET status = 'confirmed' WHERE id = $1",
        [order_id]
      );

      // 3. Finalize Inventory (Reserved -> Sold)
      // We need to fetch order items first
      const itemsResult = await client.query(
        'SELECT product_id, quantity FROM order_items WHERE order_id = $1',
        [order_id]
      );

      for (const item of itemsResult.rows) {
        await confirmStockSale(item.product_id, item.quantity, client);
      }
      
      console.log(`Order ${order_id} confirmed and inventory finalized.`);
    } else {
      console.log(`Order ${order_id} payment failed.`);
      // Optional: You could trigger a stock release here if you want to cancel the order immediately
    }

    await client.query('COMMIT');
    res.status(200).json({ status: 'received' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Webhook processing failed:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  } finally {
    client.release();
  }
};

module.exports = { handleZenopayWebhook };

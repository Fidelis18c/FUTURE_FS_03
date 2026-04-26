const db = require('../../config/db');

/**
 * Admin: Update shipment status.
 */
const updateShipmentStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ['pending', 'shipped', 'delivered'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid shipment status.' });
  }

  try {
    const result = await db.query(
      'UPDATE shipments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shipment record not found.' });
    }

    res.json({ message: 'Shipment status updated successfully.', shipment: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * Get shipment details for a specific order.
 */
const getShipmentByOrder = async (req, res, next) => {
  const { orderId } = req.params;

  try {
    const result = await db.query(
      `SELECT s.*, o.status as order_status, o.total_amount
       FROM shipments s
       JOIN orders o ON s.order_id = o.id
       WHERE s.order_id = $1`,
      [orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No shipment record found for this order.' });
    }

    // Check ownership (only owner or admin can see)
    // Assuming req.user is populated by auth middleware
    const shipment = result.rows[0];
    const orderCheck = await db.query('SELECT user_id FROM orders WHERE id = $1', [orderId]);
    
    if (orderCheck.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to view this shipment.' });
    }

    res.json(shipment);
  } catch (err) {
    next(err);
  }
};

module.exports = { updateShipmentStatus, getShipmentByOrder };

const db = require('../config/db');

/**
 * Reserves inventory for an order using Optimistic Locking.
 * @param {string} productId 
 * @param {number} quantity 
 */
const reserveStock = async (productId, quantity, client = db) => {
  const result = await client.query(
    `UPDATE inventory 
     SET available = available - $1, 
         reserved = reserved + $1, 
         version = version + 1
     WHERE product_id = $2 AND available >= $1
     RETURNING product_id`,
    [quantity, productId]
  );
  
  if (result.rows.length === 0) {
    throw new Error(`Insufficient stock for product ${productId}`);
  }
};

/**
 * Releases reserved stock back to available (on cancellation).
 */
const releaseStock = async (productId, quantity, client = db) => {
  await client.query(
    `UPDATE inventory 
     SET available = available + $1, 
         reserved = reserved - $1, 
         version = version + 1
     WHERE product_id = $2`,
    [quantity, productId]
  );
};

/**
 * Finalizes reserved stock into sold (on payment success).
 */
const confirmStockSale = async (productId, quantity, client = db) => {
  await client.query(
    `UPDATE inventory 
     SET reserved = reserved - $1, 
         sold = sold + $1, 
         version = version + 1
     WHERE product_id = $2`,
    [quantity, productId]
  );
};

module.exports = { reserveStock, releaseStock, confirmStockSale };

const db = require('../config/db');

/**
 * Reserves inventory for a specific product variant using Optimistic Locking.
 * @param {string} variantId 
 * @param {number} quantity 
 */
const reserveStock = async (variantId, quantity, client = db) => {
  const result = await client.query(
    `UPDATE inventory 
     SET available = available - $1, 
         reserved = reserved + $1, 
         version = version + 1
     WHERE variant_id = $2 AND available >= $1
     RETURNING variant_id`,
    [quantity, variantId]
  );
  
  if (result.rows.length === 0) {
    throw new Error(`Insufficient stock for variant ${variantId}`);
  }
};

/**
 * Releases reserved stock back to available (on cancellation).
 */
const releaseStock = async (variantId, quantity, client = db) => {
  await client.query(
    `UPDATE inventory 
     SET available = available + $1, 
         reserved = reserved - $1, 
         version = version + 1
     WHERE variant_id = $2`,
    [quantity, variantId]
  );
};

/**
 * Finalizes reserved stock into sold (on payment success).
 */
const confirmStockSale = async (variantId, quantity, client = db) => {
  await client.query(
    `UPDATE inventory 
     SET reserved = reserved - $1, 
         sold = sold + $1, 
         version = version + 1
     WHERE variant_id = $2`,
    [quantity, variantId]
  );
};

module.exports = { reserveStock, releaseStock, confirmStockSale };

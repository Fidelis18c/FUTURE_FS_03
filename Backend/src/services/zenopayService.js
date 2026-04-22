const axios = require('axios');
require('dotenv').config();

/**
 * Initiates a payment request with Zenopay.
 * @param {Object} paymentData - { orderId, amount, buyerName, buyerEmail, buyerPhone }
 * @returns {Promise<Object>} - Zenopay response data
 */
const initiatePayment = async ({ orderId, amount, buyerName, buyerEmail, buyerPhone }) => {
  const ZENOPAY_URL = process.env.ZENOPAY_URL; // Re-verify in production
  
  const payload = {
    account_id: process.env.ZENOPAY_ACCOUNT_ID,
    api_key: process.env.ZENOPAY_API_KEY,
    order_id: orderId,
    amount: amount,
    buyer_name: buyerName,
    buyer_email: buyerEmail,
    buyer_phone: buyerPhone,
    webhook_url: `${process.env.BASE_URL}/api/payments/webhook`
  };

  try {

    console.log("ZENOPAY PAYLOAD:", payload);

    const response = await axios.post(ZENOPAY_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ZENOPAY_API_KEY
      }
    });

    console.log(`Zenopay Payment Initiated for Order: ${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Zenopay Initiation Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to initiate Zenopay payment');
  }
};

module.exports = { initiatePayment };

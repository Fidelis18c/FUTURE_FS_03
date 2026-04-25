const axios = require('axios');
require('dotenv').config();

/**
 * Sanitizes the phone number for Zenopay (Tanzania).
 * Converts 255XXXXXXXXX to 0XXXXXXXXX if necessary.
 */
const sanitizePhone = (phone) => {
  if (!phone) return '';
  let sanitized = phone.trim().replace(/\D/g, ''); // Remove non-digits
  if (sanitized.startsWith('255')) {
    sanitized = '0' + sanitized.slice(3);
  }
  return sanitized;
};

/**
 * Initiates a payment request with Zenopay.
 * @param {Object} paymentData - { orderId, amount, buyerName, buyerEmail, buyerPhone }
 * @returns {Promise<Object>} - Zenopay response data
 */
const initiatePayment = async ({ orderId, amount, buyerName, buyerEmail, buyerPhone }) => {
  const ZENOPAY_URL = process.env.ZENOPAY_URL;
  
  // Clean payload according to ZenoAPI.com docs
  const payload = {
    order_id: orderId,
    buyer_email: buyerEmail,
    buyer_name: buyerName,
    buyer_phone: sanitizePhone(buyerPhone),
    amount: parseFloat(amount),
    webhook_url: `${process.env.BASE_URL}/api/payments/webhook`
  };

  try {
    console.log("🚀 INITIATING ZENOPAY:", { ...payload, buyer_phone: payload.buyer_phone });

    const response = await axios.post(ZENOPAY_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ZENOPAY_API_KEY
      }
    });

    console.log(`✅ Zenopay Success: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    const errorData = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error('❌ Zenopay Initiation Error:', errorData);
    throw new Error(`Zenopay failed: ${errorData}`);
  }
};

module.exports = { initiatePayment };

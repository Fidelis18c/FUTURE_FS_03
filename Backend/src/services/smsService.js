const axios = require('axios');
require('dotenv').config();

/**
 * Sends an SMS via a local Tanzanian provider (Example: Beem API).
 * @param {string} recipient - Phone number in format 255...
 * @param {string} message - Message body
 */
const sendSMS = async (recipient, message) => {
  console.log(`[SMS QUEUED] To: ${recipient}, Message: ${message}`);
  
  // Example integration with Beem Solutions
  /*
  const BEEM_AUTH = Buffer.from(`${process.env.BEEM_API_KEY}:${process.env.BEEM_SECRET_KEY}`).toString('base64');
  try {
    await axios.post('https://api.beem.africa/v1/send', {
      source_addr: 'INFO',
      schedule_time: '',
      encoding: '0',
      message: message,
      recipients: [{ recipient_id: '1', dest_addr: recipient }]
    }, {
      headers: { 'Authorization': `Basic ${BEEM_AUTH}` }
    });
  } catch (error) {
    console.error('SMS Send Failed:', error.message);
  }
  */
};

module.exports = { sendSMS };

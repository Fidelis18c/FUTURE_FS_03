const express = require('express');
const router = express.Router();
const { handleZenopayWebhook } = require('./webhookController');

// Webhook endpoint (Public - no auth)
router.post('/webhook', handleZenopayWebhook);

module.exports = router;

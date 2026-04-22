const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders } = require('./controller');
const { authenticate } = require('../../middleware/auth');

router.post('/', authenticate, createOrder);
router.get('/me', authenticate, getMyOrders);

module.exports = router;

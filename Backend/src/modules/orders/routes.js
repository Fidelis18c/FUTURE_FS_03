const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderDetails } = require('./controller');
const { authenticate } = require('../../middleware/auth');

router.post('/', authenticate, createOrder);
router.get('/me', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrderDetails);

module.exports = router;

const express = require('express');
const router = express.Router();
const { updateShipmentStatus, getShipmentByOrder } = require('./controller');
const { authenticate, authorize } = require('../../middleware/auth');

// Protected routes
router.use(authenticate);

// Admin only status update
router.patch('/:id/status', authorize(['admin']), updateShipmentStatus);

// Order specific shipment status (accessible by owner or admin)
router.get('/order/:orderId', getShipmentByOrder);

module.exports = router;

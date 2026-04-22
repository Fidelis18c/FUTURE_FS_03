const express = require('express');
const router = express.Router();
const { addAddress, getMyAddresses } = require('./addressController');
const { authenticate } = require('../../middleware/auth');

router.post('/addresses', authenticate, addAddress);
router.get('/addresses', authenticate, getMyAddresses);

module.exports = router;

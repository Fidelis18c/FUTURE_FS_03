const express = require('express');
const router = express.Router();
const { createContactMessage, getContactMessages } = require('./controller');
const { authenticate, authorize } = require('../../middleware/auth');

router.post('/', createContactMessage);
router.get('/', authenticate, authorize(['admin']), getContactMessages);

module.exports = router;

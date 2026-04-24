const express = require('express');
const router = express.Router();
const { addToCart, getMyCart, updateCartItem, removeCartItem } = require('./controller');
const { authenticate } = require('../../middleware/auth');

router.use(authenticate);

router.post('/', addToCart);
router.get('/', getMyCart);
router.put('/:id', updateCartItem);
router.delete('/:id', removeCartItem);

module.exports = router;

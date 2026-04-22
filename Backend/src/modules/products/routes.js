const express = require('express');
const router = express.Router();
const { getAllProducts, getProductBySlug } = require('./controller');

router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);

module.exports = router;

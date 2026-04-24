const express = require('express');
const router = express.Router();
const { getAllCategories, getCategoryBySlug } = require('./controller');

router.get('/', getAllCategories);
router.get('/:slug', getCategoryBySlug);

module.exports = router;

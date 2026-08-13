const express = require('express');
const router = express.Router();
const { createCategory } = require('./controller');

router.post('/categories', createCategory);

module.exports = router;

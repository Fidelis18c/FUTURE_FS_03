const express = require('express');
const router = express.Router();
const { requireAdmin } = require('./auth/middleware');

router.use(...requireAdmin);

router.use('/', require('./image/routes'));
router.use('/', require('./products/routes'));
router.use('/', require('./variants/routes'));
router.use('/', require('./categories/routes'));

module.exports = router;

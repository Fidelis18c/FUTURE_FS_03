const express = require('express');
const router = express.Router();
const { addVariant, updateVariant, deleteVariant } = require('./controller');

// Creating a variant is nested under its product; editing/removing one
// is addressed directly by its own id.
router.post('/products/:id/variants', addVariant);
router.put('/variants/:id', updateVariant);
router.delete('/variants/:id', deleteVariant);

module.exports = router;

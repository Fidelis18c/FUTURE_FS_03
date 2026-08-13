const express = require('express');
const router = express.Router();
const {
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addVariant,
  updateVariant,
  deleteVariant,
  createCategory,
} = require('./controller');
const { authenticate, authorize } = require('../../middleware/auth');

router.use(authenticate, authorize(['admin']));

router.get('/products', getAdminProducts);
router.get('/products/:id', getAdminProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.post('/products/:id/variants', addVariant);
router.put('/variants/:id', updateVariant);
router.delete('/variants/:id', deleteVariant);

router.post('/categories', createCategory);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getAdminProducts, getAdminProductById, createProduct, updateProduct, deleteProduct } = require('./controller');

router.get('/products', getAdminProducts);
router.get('/products/:id', getAdminProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;

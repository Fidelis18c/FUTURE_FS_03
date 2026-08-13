const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  uploadImage,
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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files are allowed'));
    cb(null, true);
  },
});

router.use(authenticate, authorize(['admin']));

router.post('/upload', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, uploadImage);

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

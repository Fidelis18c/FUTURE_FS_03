const express = require('express');
const router = express.Router();
const { register, login } = require('./controller');
const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.post('/register', [
  body('email').isEmail(),
  body('phone_number').notEmpty(),
  body('password').isLength({ min: 6 }),
  body('full_name').notEmpty(),
  validate
], register);

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
  validate
], login);

module.exports = router;

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Routes
app.use('/api/auth', require('./modules/auth/routes'));
app.use('/api/products', require('./modules/products/routes'));
app.use('/api/categories', require('./modules/categories/routes'));
app.use('/api/cart', require('./modules/cart/routes'));
app.use('/api/orders', require('./modules/orders/routes'));
app.use('/api/user', require('./modules/users/routes'));
app.use('/api/payments', require('./modules/payments/routes'));

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

module.exports = app;

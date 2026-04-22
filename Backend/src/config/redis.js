const Redis = require('ioredis');
require('dotenv').config();

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
};

const connection = new Redis(redisConfig);

connection.on('connect', () => {
  console.log('Redis connected successfully');
});

connection.on('error', (err) => {
  console.error('Redis connection error:', err);
});

module.exports = connection;

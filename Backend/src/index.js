require('dotenv').config();
const app = require('./app');
const db = require('./config/db');



const PORT = process.env.PORT || 5000;

// Verify Database Connection on Startup
db.query('SELECT NOW()')
  .then(() => {
    console.log('✅ Database connection test: SUCCESS');
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection test: FAILED');
    console.error(err.message);
    console.error('🔥 FULL ERROR:');
  console.error(err); // 👈 IMPORTANT

  console.error('🔥 MESSAGE:');
  console.error(err.message);

  process.exit(1);
    process.exit(1);
  });

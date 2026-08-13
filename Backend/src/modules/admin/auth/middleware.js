// Admin routes reuse the app's shared JWT auth (same login endpoint,
// POST /api/auth/login) — this just pins the role check that every
// admin route requires, in one place.
const { authenticate, authorize } = require('../../../middleware/auth');

const requireAdmin = [authenticate, authorize(['admin'])];

module.exports = { requireAdmin };

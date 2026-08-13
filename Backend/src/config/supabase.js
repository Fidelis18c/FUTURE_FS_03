const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Service-role client — server-side only, bypasses Row Level Security.
// Never expose SUPABASE_SERVICE_ROLE_KEY to the frontend.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;

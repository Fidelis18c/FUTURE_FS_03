const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Service-role client — server-side only, bypasses Row Level Security.
// Never expose SUPABASE_SERVICE_ROLE_KEY to the frontend.
//
// Built lazily (on first actual use) rather than at module load time:
// this file gets require()'d as part of the app's route-loading chain at
// server startup, so throwing here — e.g. if the env vars aren't set —
// would crash the entire backend, not just the image upload feature.
let client = null;

const getSupabase = () => {
  if (!client) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const err = new Error('Image uploads are not configured on the server — add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to the deployment environment.');
      err.status = 503;
      throw err;
    }
    client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  }
  return client;
};

module.exports = { getSupabase };

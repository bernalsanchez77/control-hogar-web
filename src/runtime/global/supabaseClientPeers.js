import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabaseClientPeers = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: { // optional
      // usually channel params like 'schema', 'events'
    },
    timeout: 10000, // milliseconds — default is 10000 (10 seconds)
    heartbeatIntervalMs: 30000,
  }
});

export default supabaseClientPeers;

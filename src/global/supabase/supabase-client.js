import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: { // optional
      // usually channel params like 'schema', 'events'
    },
    timeout: 10000 // milliseconds — default is 10000 (10 seconds)
  }
});

export default supabase;

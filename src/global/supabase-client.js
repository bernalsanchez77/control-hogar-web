import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    reconnectAfterMs: (tries) => {
      // custom strategy: retry quickly, then stabilize
      return [1000, 2000, 5000, 10000][tries - 1] || 10000
    }
  }
});

export default supabase;

import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export default async function handler(req, res) {
  // console.log('params: ', req.body);

  if (req.body) {
    const { id, date, table, state, volume, mute, color, playState, queue } = req.body;
    ({ data, error } = await supabase.from(table).update({ volume, mute, color, date, state, playState, queue }).eq('id', id));
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ message: '✅ Date updated', data });
  }
}



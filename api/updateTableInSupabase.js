import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export default async function handler(req, res) {
  console.log('params: ',req.body);
  const {newId, date, table, state, volume, mute, color, playState, currentId} = req.body;
  let data, error;
  if (currentId) {
    await supabase.from(table).update({ state: '' }).eq('id', currentId);
    ({data, error} = await supabase.from(table).update({ volume, mute, color, date, state: 'selected', playState }).eq('id', newId));
  } else {
    ({data, error} = await supabase.from(table).update({ volume, mute, color, date, state: 'selected', playState }).eq('id', newId));
  }
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ message: '✅ Date updated', data });
}



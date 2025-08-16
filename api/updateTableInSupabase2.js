import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export default async function handler(req, res) {
  const {id, date, table, state, volume, mute, color, playState, currentId} = req.body;
  let data, error;
  if (currentId) {
    ({data, error} = await supabase.from(table).update({state: ''}).eq('id', currentId));
    setTimeout(async() => {
      console.log('updating 2');
      ({data, error} = await supabase.from(table).update({volume, mute, color, date, state: 'selected', playState}).eq('id', id));
    }, 200);
  } else {
    ({data, error} = await supabase.from(table).update({volume, mute, color, date, state: 'selected', playState}).eq('id', id));
  }
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ message: '✅ Date updated', data });
}


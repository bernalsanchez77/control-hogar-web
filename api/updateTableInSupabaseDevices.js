import { supabase } from './_lib/supabase';

export default async function handler(req, res) {
  const { id, date, table, state, volume, mute, color, playState } = req.body || {};

  const { data, error } = await supabase
    .from(table)
    .update({ date, state, volume, mute, color, playState })
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: '✅ Table updated', data });
}

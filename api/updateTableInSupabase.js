import { supabase } from './_lib/supabase';

export default async function handler(req, res) {
  const {
    id = null,
    date = null,
    table = null,
    state = null,
    volume = null,
    mute = null,
    color = null,
    playState = null,
    queue = null,
    position = null,
  } = req.body || {};

  const { data, error } = await supabase
    .from(table)
    .update({ volume, mute, color, date, state, playState, queue, position })
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: '✅ Data updated', data });
}



import { supabase } from './_lib/supabase';

export default async function handler(req, res) {
  const { table, id, date, triggerUser } = req.body || {};

  const { data, error } = await supabase
    .from('selections')
    .update({ id, date, triggerUser })
    .eq('table', table);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: '✅ Selection updated', data });
}



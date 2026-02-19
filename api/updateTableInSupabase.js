import { supabase } from './_lib/supabase';

export default async function handler(req, res) {
  const { id, table, ...updateFields } = req.body || {};

  if (!id || !table) {
    return res.status(400).json({ error: 'Missing "id" or "table" in request body' });
  }

  const { data, error } = await supabase
    .from(table)
    .update(updateFields)
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: '✅ Data updated', data });
}



import { supabase } from './_lib/supabase';

export default async function handler(req, res) {
  const { table } = req.query;

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
}

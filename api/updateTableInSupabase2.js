import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export default async function handler(req, res) {

  const table = req.body.table;
  const id = req.body.id;
  const date = req.body.date;

  let data, error;
  ({ data, error } = await supabase.from('selections').update({ id: id, date: date }).eq('table', table));
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ message: '✅ Date updated', data });
}



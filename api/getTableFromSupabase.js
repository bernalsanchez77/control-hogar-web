import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  const {table} = req.body;
  console.log('table: ', table);
  const {data, error} = await supabase.from(table).select('*').order('order', { ascending: true }) // or descending: false
  if (error) {
    return res.status(500).json({ error: error.message })
  }
  res.status(200).json(data)
}

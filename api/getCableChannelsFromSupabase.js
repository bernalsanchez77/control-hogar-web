import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
console.log('se llamo a cable-channels');
export default async function handler(req, res) {
  const { data, error } = await supabase.from('cableChannels').select('*').order('number', { ascending: true }) // or descending: false
  if (error) {
    return res.status(500).json({ error: error.message })
  }
  res.status(200).json(data)
}

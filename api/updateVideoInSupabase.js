import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  const {id, date} = req.body
  const {data, error} = await supabase.from('youtube-videos-liz').update({date, state: 'selected'}).eq('id', id)
  if (error) {
    return res.status(500).json({ error: error.message })
  }
  res.status(200).json({ message: '✅ Date updated', data })
}

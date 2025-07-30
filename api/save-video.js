import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  const { label, description, youtube_id } = req.body
  const { data, error } = await supabase
    .from('videos')
    .insert([{ label, description, youtube_id }])

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(200).json({ message: 'Video saved', data })
}

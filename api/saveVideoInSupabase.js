import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  const {label, description, yid, state, img, order, channel, date} = req.body;
  const {data, error} = await supabase.from('youtube-videos-liz').insert([{label, description, yid, state, img, order, channel, date}]);
  if (error) {
    return res.status(500).json({ error: error.message })
  }
  res.status(200).json({ message: 'Video saved', data })
}

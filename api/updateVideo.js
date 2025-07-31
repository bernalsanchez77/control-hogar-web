import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  const {videoId, videoDate} = req.body
  const {data, error} = await supabase.from('youtube-videos-liz').update({videoDate}).eq('videoId', videoId)
  if (error) {
    return res.status(500).json({ error: error.message })
  }
  res.status(200).json({ message: '✅ Date updated', data })
}

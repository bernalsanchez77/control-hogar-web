import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  const { data, error } = await supabase.from('youtube-videos-liz').select('*').order('date', { ascending: true }) // or descending: false
  if (error) {
    return res.status(500).json({ error: error.message })
  }
  res.status(200).json(data)

  supabase.channel('youtube-videos-liz-changes').on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'youtube-videos-liz'},
    payload => {console.log('Change received!', payload);}).subscribe();
}

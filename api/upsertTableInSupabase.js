import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export default async function handler(req, res) {

  let id = null;
  let date = null;
  let table = null;
  let state = null;
  let volume = null;
  let mute = null;
  let color = null;
  let playState = null;
  let queue = null;
  let position = null;

  if (req.body) {
    id = req.body.id;
    date = req.body.date;
    table = req.body.table;
    state = req.body.state;
    volume = req.body.volume;
    mute = req.body.mute;
    color = req.body.color;
    playState = req.body.playState;
    queue = req.body.queue;
    position = req.body.position;
    title = req.body.title;
    duration = req.body.duration;
    channelId = req.body.channelId;
  }

  let data, error;
  ({ data, error } = await supabase.from(table).upsert({ id, volume, mute, color, date, state, playState, queue, position, title, duration, channelId }));
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ message: '✅ Date updated', data });
}

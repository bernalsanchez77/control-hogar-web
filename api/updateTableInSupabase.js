import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export default async function handler(req, res) {
  // console.log('params: ', req.body);

  let id = null;
  let date = null;
  let table = null;
  let state = null;
  let volume = null;
  let mute = null;
  let color = null;
  let playState = null;
  let videoId = null;
  let videoTitle = null;
  let videoDuration = null;
  let videoPosition = null;
  let videoImg = null;
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
    videoId = req.body.videoId;
    videoTitle = req.body.videoTitle;
    videoDuration = req.body.videoDuration;
    videoPosition = req.body.videoPosition;
    videoImg = req.body.videoImg;
    queue = req.body.queue;
    position = req.body.position;
  }

  let data, error;
  ({ data, error } = await supabase.from(table).update({ volume, mute, color, date, state, playState, videoId, videoTitle, videoDuration, videoPosition, videoImg, queue, position }).eq('id', id));
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ message: '✅ Date updated', data });
}



import { supabase } from './_lib/supabase';

export default async function handler(req, res) {
  const {
    id = null,
    date = null,
    table = null,
    state = null,
    volume = null,
    mute = null,
    color = null,
    playState = null,
    queue = null,
    position = null,
    title = null,
    duration = null,
    channelId = null,
    user = null,
    order = null,
    img = null,
  } = req.body || {};

  let data, error;

  if (table === 'youtubeChannelsLiz') {
    ({ data, error } = await supabase
      .from(table)
      .upsert({ id, title, order, user, img }));
  } else if (table === 'youtubeVideos') {
    ({ data, error } = await supabase
      .from(table)
      .upsert({ id, volume, mute, color, date, state, playState, queue, position, title, duration, channelId, user, order }));
  }

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: '✅ Data updated', data });
}

import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export default async function handler(req, res) {
  // console.log('params: ', req.body);

  let newId = null;
  let newDate = null;
  let newTable = null;
  let newState = null;
  let newVolume = null;
  let newMute = null;
  let newColor = null;
  let newPlayState = null;
  let newQueue = null;

  if (req.body) {
    newId = req.body.newId;
    newDate = req.body.newDate;
    newTable = req.body.newTable;
    newState = req.body.newState;
    newVolume = req.body.newVolume;
    newMute = req.body.newMute;
    newColor = req.body.newColor;
    newPlayState = req.body.newPlayState;
    newQueue = req.body.newQueue;
  }

  let data, error;
  ({ data, error } = await supabase.from(newTable).update({ volume: newVolume, mute: newMute, color: newColor, date: newDate, state: newState, playState: newPlayState, queue: newQueue }).eq('id', newId));
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ message: '✅ Date updated', data });
}



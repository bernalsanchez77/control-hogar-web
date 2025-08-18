import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export default async function handler(req, res) {
  console.log('params: ',req.body);
  const {currentId, currentTable, currentState} = req.body.current;
  const {newId, newDate, newTable, newState, newVolume, newMute, newColor, newPlayState} = req.body.new;
  let data, error;
  if (req.body.current) {
    await supabase.from(currentTable).update({
      state: currentState
    }).eq('id', currentId);
    ({data, error} = await supabase.from(newTable).update({
      volume: newVolume,
      mute: newMute,
      color: newColor,
      date: newDate,
      state: newState,
      playState: newPlayState
    }).eq('id', newId));
  } else {
    ({data, error} = await supabase.from(table).update({
      volume: newVolume,
      mute: newMute,
      color: newColor,
      date: newDate,
      state: newState,
      playState: newPlayState
    }).eq('id', newId));
  }
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ message: '✅ Date updated', data });
}



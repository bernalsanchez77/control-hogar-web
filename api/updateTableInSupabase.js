import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export default async function handler(req, res) {
  console.log('params: ',req.body);

  let currentId = null;
  let currentTable = null;
  let currentState = null;

  let newId = null;
  let newDate = null;
  let newTable = null;
  let newState = null;
  let newVolume = null;
  let newMute = null;
  let newColor = null;
  let newPlayState = null;

  if (req.body.current) {
    currentId = req.body.current.currentId;
    currentTable = req.body.current.currentTable;
    currentState = req.body.current.currentState;
  };
  if (req.body.new) {
    newId = req.body.new.newId;
    newDate = req.body.new.newDate;
    newTable = req.body.new.newTable;
    newState = req.body.new.newState;
    newVolume = req.body.new.newVolume;
    newMute = req.body.new.newMute;
    newColor = req.body.new.newColor;
    newPlayState = req.body.new.newPlayState;
  }

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



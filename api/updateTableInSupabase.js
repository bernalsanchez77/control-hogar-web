import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  console.log('params: ', req.body);

  const current = req.body.current || {};
  const next = req.body.new || {};

  if (!next.newTable || !next.newId) {
    return res.status(400).json({ error: "Missing newTable or newId" });
  }

  // 1) Clear current if exists
  if (current.currentId && current.currentTable) {
    const { error: currentError } = await supabase
      .from(current.currentTable)
      .update({ state: current.currentState })
      .eq('id', current.currentId);

    if (currentError) {
      return res.status(500).json({ error: currentError.message });
    }
  }

  // 2) Update next
  const { data, error } = await supabase
    .from(next.newTable)
    .update({
      volume: next.newVolume,
      mute: next.newMute,
      color: next.newColor,
      date: next.newDate,
      state: next.newState,
      playState: next.newPlayState,
    })
    .eq('id', next.newId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: '✅ Record updated', data });
}

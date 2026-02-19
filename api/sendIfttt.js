export default async function handler(req, res) {
  const { device, key, value } = req.query;
  const token = process.env.REACT_APP_SEND_KEY;

  try {
    const url = `https://maker.ifttt.com/trigger/${device}/with/key/${token}?value1=${key}&value2=${value}`;
    console.log('IFTTT Trigger:', url);

    const response = await fetch(url);
    const data = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({ error: 'IFTTT error', details: data });
    }

    res.status(200).json({ message: '✅ IFTTT triggered', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
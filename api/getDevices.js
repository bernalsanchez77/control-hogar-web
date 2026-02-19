export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const endpoint = process.env.REACT_APP_STATES_KEY;

  try {
    const response = await fetch(endpoint);
    const rawContent = await response.text();

    // Clean potential prefix from logic outside JSON
    const cleanedJson = rawContent.trim().replace(/^[^\[{]+/, '');
    const data = JSON.parse(cleanedJson);

    res.status(200).json(data);
  } catch (err) {
    console.error('getDevices error:', err);
    res.status(500).json({ error: 'Fetching devices failed', details: err.message });
  }
}
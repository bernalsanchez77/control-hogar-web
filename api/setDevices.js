export default async function handler(req, res) {
  const endpoint = process.env.REACT_APP_STATES_KEY;

  try {
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({ error: 'Failed to update devices', details: errorData });
    }

    const data = await response.json();
    res.status(200).json({ message: '✅ Devices updated', data });
  } catch (err) {
    console.error('setDevices error:', err);
    res.status(500).json({ error: err.message });
  }
}

// api/putProxy.js
export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method Error' });
  }
  try {
    // const key = process.env.REACT_APP_STATES_KEY;
    const key = 'https://ifttt.massmedia.stream/api/v1/bersanesp/data2';
    const body = req.body;
    const response = await fetch(key, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({error: 'Error:', details: err.message});
  }
}

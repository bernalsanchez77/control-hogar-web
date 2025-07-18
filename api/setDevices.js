export default async function handler(req, res) {
  try {
    const key = process.env.REACT_APP_STATES_KEY;
    const body = req.body;
    const response = await fetch(key, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method Error' });
    }
    try {
      const key = 'https://ifttt.massmedia.stream/api/v1/bersanesp/data2';
      // const key = process.env.REACT_APP_STATES_KEY;
      const response = await fetch(key);
      const raw = await response.text();
      const cleaned = raw.trim().replace(/^[^\[{]+/, '');
      const data = JSON.parse(cleaned);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({error: 'Error: ', details: err.message});
    }
  }
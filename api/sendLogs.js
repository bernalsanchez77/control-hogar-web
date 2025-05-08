export default function handler(req, res) {
    if (req.method === 'POST') {
      const ip = req.headers['x-forwarded-for']?.split(',')[0];
      const { message } = req.body;
      console.log('Log:', message + ' ' + ip);
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Método no permitido' });
  }
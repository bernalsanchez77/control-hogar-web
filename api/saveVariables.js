// api/putProxy.js
export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const body = req.body;

    const response = await fetch('https://ifttt.massmedia.stream/api/v1/bersanesp/data', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al hacer PUT', details: err.message });
  }
}

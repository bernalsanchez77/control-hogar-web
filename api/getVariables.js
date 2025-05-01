export default async function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Método no permitido' });
    }
  
    try {
      const response = await fetch('https://ifttt.massmedia.stream/api/v1/bersanesp/data');

      const raw = await response.text();
      const cleaned = raw.trim().replace(/^[^\[{]+/, ''); // elimina basura al inicio
  
      // Intentar parsear
      const data = JSON.parse(cleaned);

      res.status(200).json(data); // Devuelves la respuesta JSON al cliente
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener datos', details: err.message });
    }
  }
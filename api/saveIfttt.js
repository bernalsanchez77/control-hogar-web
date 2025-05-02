export default async function handler(req, res) {
    const este = 'LamparaComedorOn';
    try {
      const response = await fetch('https://maker.ifttt.com/trigger/' + este + '/with/key/i4M0yNSEdCF7dQdEMs5e_XhA1BnQypmCTWIrlPVidUG?value1=');
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener datos', details: err.message });
    }
  }
  
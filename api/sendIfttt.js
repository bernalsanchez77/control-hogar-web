export default async function handler(req, res) {
    const { device, state } = req.query;
    try {
      const deviceUpperCase = device[0].toUpperCase() + device.slice(1);
      const stateUpperCase = state[0].toUpperCase() + state.slice(1);
      const response = await fetch('https://maker.ifttt.com/trigger/' + deviceUpperCase + stateUpperCase + '/with/key/i4M0yNSEdCF7dQdEMs5e_XhA1BnQypmCTWIrlPVidUG?value1=');
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener datos', details: err.message });
    }
  }
  
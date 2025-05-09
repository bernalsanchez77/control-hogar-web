export default async function handler(req, res) {
    const { device, state, nuevo } = req.query;
    try {
      const deviceUpperCase = device[0].toUpperCase() + device.slice(1);
      const stateUpperCase = state[0].toUpperCase() + state.slice(1);
      const key = process.env.REACT_APP_SEND_KEY;
      let response = '';
      if (nuevo) {
        console.log('ifttt: ', 'https://maker.ifttt.com/trigger/' + device + '/with/key/' + key + '?value1=' + state);
        response = await fetch('https://maker.ifttt.com/trigger/' + device + '/with/key/' + key + '?value1=' + state);
      } else {
        response = await fetch('https://maker.ifttt.com/trigger/' + deviceUpperCase + stateUpperCase + '/with/key/' + key);
      }
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener datos', details: err.message });
    }
  }
  
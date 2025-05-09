export default async function handler(req, res) {
    const {device, key, value} = req.query;
    try {
      const token = process.env.REACT_APP_SEND_KEY;
      let response = '';
      console.log('ifttt: ', 'https://maker.ifttt.com/trigger/' + device + '/with/key/' + token + '?value1=' + key + '&value2=' + value);
      // response = await fetch('https://maker.ifttt.com/trigger/' + device + '/with/key/' + token + '?value1=' + key + '&value2=' + value);
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener datos', details: err.message });
    }
  }
  
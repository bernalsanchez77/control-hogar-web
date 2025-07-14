export default function handler(req, res) {
    const { key } = req.body;
    if (req.method !== "POST") {
      return res.status(405).end();
    }
    let validKey = false;
    let dev = false;
    // if (key === process.env.REACT_APP_CREDENTIALS_KEY) {
    //   validKey = true;
    // }
    // if (key === process.env.REACT_APP_DEV_CREDENTIALS_KEY) {
    //   validKey = true;
    //   dev = 'dev';
    // }
    if (key === 'Momo') {
      validKey = true;
    }
    if (key === 'Moma') {
      validKey = true;
      dev = 'dev';
    }
    res.status(200).json({ success: validKey, dev});
  }
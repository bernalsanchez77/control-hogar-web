export default function handler(req, res) {
    const { key } = req.body;
    if (req.method !== "POST") {
      return res.status(405).end();
    }
    const validKey = ''
    if (key === process.env.REACT_APP_CREDENTIALS_KEY) {
      res.status(200).json({ success: isValid});
    }
    if (key === process.env.REACT_APP_DEV_CREDENTIALS_KEY) {
      res.status(200).json({ success: isValid});
    }
  }
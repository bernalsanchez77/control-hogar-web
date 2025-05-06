export default function handler(req, res) {
    const { key } = req.body;
    if (req.method !== "POST") {
      return res.status(405).end();
    }
    const validKey = process.env.REACT_APP_CREDENTIALS_KEY;
    const isValid = key === validKey;
    res.status(200).json({ success: isValid });
  }
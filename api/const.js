export default function handler(req, res) {
    const { key } = req.body;
  
    if (req.method !== "POST") {
      return res.status(405).end(); // Solo POST permitido
    }
  
    // const validKey = process.env.SECRET_KEY;

    const validKey = '123';
  
    const isValid = key === validKey;
  
    res.status(200).json({ success: isValid });
  }
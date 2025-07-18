export default function handler(req, res) {
    const {message} = req.body;
    console.log('Log: ', message);
    return res.status(200).json({ status: 200, data: {} });
  }
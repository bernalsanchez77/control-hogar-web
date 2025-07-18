export default function handler(req, res) {
    const {key} = req.body;
    let validUser = false;
    let dev = false;
    if (key === process.env.REACT_APP_CREDENTIALS_KEY) {
      validUser = true;
    }
    if (key === process.env.REACT_APP_DEV_CREDENTIALS_KEY) {
      validUser = true;
      dev = true;
    }
    res.status(200).json({ status: 200, validUser: validUser, dev});
  }
export default async function handler(req, res) {
    const {key} = req.body;
    let validUser = false;
    let dev = '';
    if (key === process.env.REACT_APP_CREDENTIALS_KEY) {
      validUser = true;
    }
    if (key === process.env.REACT_APP_DEV_CREDENTIALS_KEY) {
      validUser = true;
      dev = 'dev';
    }
    res.status(200).json({ status: 200, validUser: validUser, dev});
  }
// api/putProxy.js
export default async function handler(req, res) {
  try {
    const key = process.env.REACT_APP_STATES_KEY_2;
    const body = req.body;
    console.log(body);
    const response = await fetch(key, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    res.status(200).json({status: 200});
  } catch (err) {
    console.log('reset error: ', err);
    res.status(500).json({error: 'Error:', details: err.message});
  }
}

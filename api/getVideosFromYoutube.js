export default async function handler(req, res) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const { q } = req.query; // Get search term from URL
  try {
    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50&q=${encodeURIComponent(q)}&key=${apiKey}`;
    const response = await fetch(youtubeUrl);
    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ error: data.error || 'YouTube API error' });
    }
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}


export default async function handler(req, res) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const { q } = req.query;

  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50&q=${encodeURIComponent(q)}&key=${apiKey}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    if (!searchResponse.ok) {
      return res.status(500).json({ error: searchData.error || 'YouTube Search API error' });
    }
    if (!searchData.items || searchData.items.length === 0) {
      return res.status(200).json(searchData);
    }
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`;
    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();
    if (!videosResponse.ok) {
      return res.status(200).json(searchData);
    }
    const durationMap = {};
    videosData.items.forEach(video => {
      durationMap[video.id] = video.contentDetails.duration;
    });
    const mergedItems = searchData.items.map(item => ({
      ...item,
      contentDetails: {
        duration: durationMap[item.id.videoId] || null
      }
    }));
    searchData.items = mergedItems;
    return res.status(200).json(searchData);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
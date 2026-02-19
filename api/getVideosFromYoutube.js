export default async function handler(req, res) {
  const { q } = req.query;
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!q) {
    return res.status(400).json({ error: 'Missing search query "q"' });
  }

  try {
    // 1. Search for videos
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50&q=${encodeURIComponent(q)}&key=${apiKey}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      return res.status(searchResponse.status).json({ error: searchData.error || 'YouTube Search API error' });
    }

    if (!searchData.items || searchData.items.length === 0) {
      return res.status(200).json(searchData);
    }

    // 2. Fetch video details to get durations
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`;
    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();

    if (!videosResponse.ok) {
      // Return search result even if duration fetch fails
      return res.status(200).json(searchData);
    }

    // 3. Map durations back to search items
    const durationMap = {};
    videosData.items.forEach(video => {
      durationMap[video.id] = video.contentDetails.duration;
    });

    searchData.items = searchData.items.map(item => ({
      ...item,
      contentDetails: {
        duration: durationMap[item.id.videoId] || null
      }
    }));

    return res.status(200).json(searchData);
  } catch (err) {
    console.error('getVideosFromYoutube error:', err);
    return res.status(500).json({ error: err.message });
  }
}
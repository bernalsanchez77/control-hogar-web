import {useRef} from 'react';
import './youtube.css';

function Youtube({devicesState, view, rokuApps, youtubeSearchVideos, youtubeChannelsLiz, youtubeVideosLiz, changeControlParent, changeViewParent}) {
  let youtubeSortedVideos = [];
  let youtubeSortedChannels = [];
  let touchMoved = false;
  let touchStartY = 0;
  const channelSelected = useRef('');

  const changeView = (channel) => {
    channelSelected.current = channel;
    const newView = {...view};
    newView.apps.youtube.channel = channel;
    newView.apps.youtube.mode = 'channel';
    changeViewParent(newView);
  };
  const changeControl = (video) => {
    const device = 'rokuSala';
    const rokuId = rokuApps.find(app => app.id === 'youtube').rokuId;
    changeControlParent({
      roku: [{device, key: 'launch', value: rokuId, params: {contentID: video}}],
      massMedia: [{device: device, key: 'video', value: video}],
    });
  };
  if (view.apps.youtube.mode === '') {
    youtubeSortedChannels = Object.values(youtubeChannelsLiz).sort((a, b) => a.order - b.order);
  }
  if (view.apps.youtube.mode === 'channel') {
    youtubeSortedVideos = youtubeVideosLiz.filter(video => video.channelId === channelSelected.current);
    youtubeSortedVideos = Object.values(youtubeSortedVideos).sort((a, b) => new Date(a.videoDate) - new Date(b.videoDate));
  }
  if (view.apps.youtube.mode === 'search') {
    youtubeSortedVideos = youtubeSearchVideos.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      img: item.snippet.thumbnails.medium.url,
    }));
  }

  const onTouchStart = (e) => {
    touchStartY = e.touches[0].clientY;
    touchMoved = false;
  }

  const onTouchMove = (e) => {
    const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
    if (deltaY > 10) {
      touchMoved = true;
    }
  }

  const onTouchEnd = (e, video) => {
    if (!touchMoved) {
      changeControl(video);
    }
  }

  return (
    <div>
      {view.apps.youtube.mode === '' &&
      <div className='controls-apps-youtube'>
        <ul className='controls-apps-youtube-ul'>
          {
            youtubeSortedChannels.map((channel, key) => (
            <li key={key} className='controls-apps-youtube-li'>
              <button
                className={'controls-apps-youtube-channel-button'}
                onTouchStart={() => changeView(channel.id)}>
                <img
                  className='controls-apps-youtube-channel-img'
                  src={channel.img}
                  alt="icono">
                </img>
                <p className='controls-apps-youtube-channel-title'>
                  {channel.title}
                </p>
              </button>
            </li>
            ))
          }
        </ul>
      </div>
      }
      {(view.apps.youtube.mode === 'channel' || view.apps.youtube.mode === 'search') &&
      <div className='controls-apps-youtube'>
        <ul className='controls-apps-youtube-ul'>
          {
            youtubeSortedVideos.map((video, key) => (
            <li key={key} className='controls-apps-youtube-li'>
              <button
                className={`controls-apps-youtube-video-button ${devicesState.rokuSala.video === video.id ? 'controls-apps-youtube-video-button--selected' : ''}`}
                onTouchStart={(e) => onTouchStart(e, video.id)}
                onTouchMove={(e) => onTouchMove(e, video.id)}
                onTouchEnd={(e) => onTouchEnd(e, video.id)}>
                <img
                  className='controls-apps-youtube-video-img'
                  src={video.img}
                  alt="icono">
                </img>
                <p className='controls-apps-youtube-video-title'>
                  {video.title}
                </p>
              </button>
            </li>
            ))
          }
        </ul>
      </div>
      }
    </div>
  )
}

export default Youtube;

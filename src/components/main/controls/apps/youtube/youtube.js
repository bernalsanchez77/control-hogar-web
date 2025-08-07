import {useRef} from 'react';
import './youtube.css';

function Youtube({devicesState, view, rokuApps, youtubeSearchVideos, youtubeLizVideos, changeControlParent, changeViewParent}) {
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
    const refMap = {};
    youtubeLizVideos.forEach(video => {
      refMap[video.channelId] = {
        channelId: video.channelId,
        channelOrder: video.channelOrder,
        channelImg: video.channelImg,
        channelTitle: video.channelTitle,
      }
    });
    youtubeSortedChannels = Object.values(refMap).sort((a, b) => a.channelOrder - b.channelOrder);
  }
  if (view.apps.youtube.mode === 'channel') {
    youtubeSortedVideos = youtubeLizVideos.filter(video => video.channelId === channelSelected.current);
    youtubeSortedVideos = Object.values(youtubeSortedVideos).sort(
      (a, b) => new Date(a.videoDate) - new Date(b.videoDate)
    );
  }
  if (view.apps.youtube.mode === 'search') {
    youtubeSortedVideos = youtubeSearchVideos.map(item => ({
      videoId: item.id.videoId,
      videoTitle: item.snippet.title,
      videoDescription: item.snippet.description,
      videoImg: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
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
                onTouchStart={() => changeView(channel.channelId)}>
                <img
                  className='controls-apps-youtube-channel-img'
                  src={channel.channelImg}
                  alt="icono">
                </img>
                <p className='controls-apps-youtube-channel-title'>
                  {channel.channelTitle}
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
                className={`controls-apps-youtube-video-button ${devicesState.rokuSala.video === video.videoId ? 'controls-apps-youtube-video-button--selected' : ''}`}
                onTouchStart={(e) => onTouchStart(e, video.videoId)}
                onTouchMove={(e) => onTouchMove(e, video.videoId)}
                onTouchEnd={(e) => onTouchEnd(e, video.videoId)}>
                <img
                  className='controls-apps-youtube-video-img'
                  src={video.videoImg}
                  alt="icono">
                </img>
                <p className='controls-apps-youtube-video-title'>
                  {video.videoTitle}
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

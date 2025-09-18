import {useRef, useEffect} from 'react';
import './youtube.css';

function Youtube({rokuPlayState, view, rokuApps, youtubeSearchVideos, youtubeChannelsLiz, youtubeVideosLiz, changeControlParent, changeViewParent}) {
  const timeout3s = useRef(null);
  const longClick = useRef(false);
  let youtubeSortedVideos = [];
  let youtubeSortedChannels = [];
  let touchMoved = false;
  let touchStartY = 0;
  const channelSelected = useRef('');

  const changeView = (channel) => {
    localStorage.setItem('channelSelected', channel);
    channelSelected.current = channel;
    const newView = structuredClone(view);
    newView.roku.apps.youtube.channel = channel;
    newView.roku.apps.youtube.mode = 'channel';
    changeViewParent(newView);
  };
  const changeControl = (video) => {
    const currentVideo = youtubeVideosLiz.find(vid => vid.state === 'selected');
    if (currentVideo?.id !== video) {
      const device = 'rokuSala';
      const rokuId = rokuApps.find(app => app.id === 'youtube').rokuId;
      changeControlParent({
        roku: [{device, key: 'launch', value: rokuId, params: {contentID: video}}],
        massMedia: [{device: device, key: 'video', value: video}],
      });   
    }
  };
  if (view.roku.apps.youtube.mode === '') {
    youtubeSortedChannels = Object.values(youtubeChannelsLiz).sort((a, b) => a.order - b.order);
  }
  if (view.roku.apps.youtube.mode === 'channel') {
    channelSelected.current = channelSelected.current || localStorage.getItem('channelSelected');
    youtubeSortedVideos = youtubeVideosLiz.filter(video => video.channelId === channelSelected.current);
    youtubeSortedVideos = Object.values(youtubeSortedVideos).sort((a, b) => new Date(a.videoDate) - new Date(b.videoDate));
  }
  if (view.roku.apps.youtube.mode === 'search') {
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
    timeout3s.current = setTimeout(() => {
      longClick.current = true;
    }, 500);
  };

  const onTouchMove = (e) => {
    const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
    if (deltaY > 10) {
      touchMoved = true;
    }
  };

  const onTouchEnd = (e, type, video) => {
    e.preventDefault();
    clearTimeout(timeout3s.current);
    if (!touchMoved) {
      if (longClick.current) {
        console.log('long click');
        video.state = 'queue';
      } else {
        if (type === 'channel') {
          changeView(video.id);
        }
        if (type === 'video') {
          changeControl(video.id);
        }
      }
    }
    longClick.current = false;
  };

  useEffect(() => {
    if (rokuPlayState && rokuPlayState.state === 'play') {
      console.log('position effect: ', parseInt(rokuPlayState.position) / 1000);
    }
  }, [rokuPlayState]);

  const timeToSeconds = (timeString) => {
    const parts = timeString.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    return totalSeconds;
  }

  return (
    <div>
      {view.roku.apps.youtube.mode === '' &&
      <div className='controls-apps-youtube'>
        <ul className='controls-apps-youtube-ul'>
          {
            youtubeSortedChannels.map((channel, key) => (
            <li key={key} className='controls-apps-youtube-li'>
              <button
                className={'controls-apps-youtube-channel-button'}
                onTouchStart={(e) => onTouchStart(e)}
                onTouchMove={(e) => onTouchMove(e)}
                onTouchEnd={(e) => onTouchEnd(e, 'channel', channel)}>
                <img
                  className='controls-apps-youtube-channel-img'
                  src={channel.img || 'https://control-hogar-psi.vercel.app/imgs/youtube-channels/' + channel.id + '.png'}
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
      {(view.roku.apps.youtube.mode === 'channel') &&
      <div className='controls-apps-youtube controls-apps-youtube--channel'>
        <ul className='controls-apps-youtube-ul'>
          {
            youtubeSortedVideos.map((video, key) => (
            <li key={key} className='controls-apps-youtube-li-channel'>
              <button
                className={`controls-apps-youtube-video-button ${video.state === 'selected' ? 'controls-apps-youtube-video-button--selected' : ''}`}
                onTouchStart={(e) => onTouchStart(e)}
                onTouchMove={(e) => onTouchMove(e)}
                onTouchEnd={(e) => onTouchEnd(e, 'video', video)}>
                <div>
                  <img
                    className={`controls-apps-youtube-video-img ${video.state === 'queue' ? 'controls-apps-youtube-video-img--queue' : ''}`}
                    src={view.roku.apps.youtube.mode === 'channel' ? video.img || 'https://img.youtube.com/vi/' + video.id + '/sddefault.jpg' : video.img}
                    alt="icono">
                  </img>
                </div>
                <p className='controls-apps-youtube-video-title'>
                  {video.title}
                </p>
                <p className='controls-apps-youtube-video-duration'>
                  {video.duration}
                </p>
                <p className='controls-apps-youtube-video-duration'>
                  {rokuPlayState && rokuPlayState.state === 'play' ? `${parseInt(rokuPlayState.position) / 1000}`: ''}
                </p>
              </button>
            </li>
            ))
          }
        </ul>
      </div>
      }
      {(view.roku.apps.youtube.mode === 'search') &&
      <div className='controls-apps-youtube controls-apps-youtube--search'>
        <ul className='controls-apps-youtube-ul'>
          {
            youtubeSortedVideos.map((video, key) => (
            <li key={key} className='controls-apps-youtube-li-search'>
              <button
                className={`controls-apps-youtube-video-button ${video.state === 'selected' ? 'controls-apps-youtube-video-button--selected' : ''}`}
                onTouchStart={(e) => onTouchStart(e)}
                onTouchMove={(e) => onTouchMove(e)}
                onTouchEnd={(e) => onTouchEnd(e, 'video', video)}>
                <img
                  className='controls-apps-youtube-video-img'
                  src={view.roku.apps.youtube.mode === 'channel' ? 'https://img.youtube.com/vi/' + video.id + '/sddefault.jpg' : video.img}
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

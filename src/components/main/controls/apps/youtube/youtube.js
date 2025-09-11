import {useRef} from 'react';
import './youtube.css';

function Youtube({view, rokuApps, youtubeSearchVideos, youtubeChannelsLiz, youtubeVideosLiz, changeControlParent, changeViewParent}) {
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
  }

  const onTouchMove = (e) => {
    const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
    if (deltaY > 10) {
      touchMoved = true;
    }
  }

  const onTouchEnd = (type ,video) => {
    if (!touchMoved) {
      if (type === 'channel') {
        changeView(video);
      }
      if (type === 'video') {
        changeControl(video);
      }
    }
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
                onTouchEnd={(e) => onTouchEnd('channel', channel.id)}>
                <img
                  className='controls-apps-youtube-channel-img'
                  src={'https://control-hogar-psi.vercel.app/imgs/youtube-channels/' + channel.id + '.png'}
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
                onTouchEnd={(e) => onTouchEnd('video', video.id)}>
                <img
                  className='controls-apps-youtube-video-img'
                  src={view.roku.apps.youtube.mode === 'channel' ? video.img || 'https://img.youtube.com/vi/' + video.id + '/sddefault.jpg' : video.img}
                  alt="icono">
                </img>
                <p className='controls-apps-youtube-video-title'>
                  {video.title}
                </p>
                <p className='controls-apps-youtube-video-duration'>
                  {video.duration}
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
                onTouchEnd={(e) => onTouchEnd('video', video.id)}>
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

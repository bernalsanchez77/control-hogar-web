import { useRef } from 'react';
import { store } from "../../../../../store/store";
import viewRouter from '../../../../../global/view-router';
import youtube from '../../../../../global/youtube';
import utils from '../../../../../global/utils';
import './youtube.css';

function Youtube() {
  const youtubeSearchVideosSt = store(v => v.youtubeSearchVideosSt);
  const youtubeChannelsLizSt = store(v => v.youtubeChannelsLizSt);
  const youtubeVideosLizSt = store(v => v.youtubeVideosLizSt);
  const viewSt = store(v => v.viewSt);
  const timeout3s = useRef(null);
  const longClick = useRef(false);
  let youtubeSortedVideos = [];
  let youtubeSortedChannels = [];
  let touchMoved = false;
  let touchStartY = 0;
  const channelSelected = useRef('');

  const onChannelShortClick = (channel) => {
    utils.triggerVibrate();
    localStorage.setItem('channelSelected', channel);
    channelSelected.current = channel;
    const newView = structuredClone(viewSt);
    newView.roku.apps.youtube.channel = channel;
    newView.roku.apps.youtube.mode = 'channel';
    viewRouter.changeView(newView);
  };

  if (viewSt.roku.apps.youtube.mode === '') {
    youtubeSortedChannels = Object.values(youtubeChannelsLizSt).sort((a, b) => a.order - b.order);
  }
  if (viewSt.roku.apps.youtube.mode === 'channel') {
    channelSelected.current = channelSelected.current || localStorage.getItem('channelSelected');
    youtubeSortedVideos = youtubeVideosLizSt.filter(video => video.channelId === channelSelected.current);
    youtubeSortedVideos = Object.values(youtubeSortedVideos).sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  if (viewSt.roku.apps.youtube.mode === 'search') {
    youtubeSortedVideos = youtubeSearchVideosSt.map(item => ({
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
    console.log('touch moved', touchMoved);
    if (!touchMoved) {
      if (longClick.current) {
        console.log('long click');
        utils.triggerVibrate();
        youtube.handleQueue(video);
      } else {
        console.log('short click');
        if (type === 'channel') {
          utils.triggerVibrate();
          onChannelShortClick(video.id);
        }
        if (type === 'video') {
          utils.triggerVibrate();
          youtube.onVideoShortClick(video);
        }
      }
    }
    longClick.current = false;
  };

  const getQueueConsecutiveNumber = (video) => {
    let sortedQueue = [...youtubeVideosLizSt].sort((a, b) => {
      return Number(a.queue) - Number(b.queue);
    });
    sortedQueue = sortedQueue.filter(obj => Number(obj.queue) !== 0);
    if (sortedQueue.includes(video)) {
      return sortedQueue.findIndex(obj => obj.id === video.id) + 1;
    } else {
      return 0;
    }
  };

  return (
    <div>
      {viewSt.roku.apps.youtube.mode === '' &&
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
      {(viewSt.roku.apps.youtube.mode === 'channel') &&
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
                        className={`controls-apps-youtube-video-img ${video.queue > 0 ? 'controls-apps-youtube-video-img--queue' : ''}`}
                        src={viewSt.roku.apps.youtube.mode === 'channel' ? video.img || 'https://img.youtube.com/vi/' + video.id + '/sddefault.jpg' : video.img}
                        alt="icono">
                      </img>
                      <div className='controls-apps-youtube-video-queue-number'>
                        <span>{getQueueConsecutiveNumber(video) || ''}</span>
                      </div>
                    </div>
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
      {(viewSt.roku.apps.youtube.mode === 'search') &&
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
                      src={viewSt.roku.apps.youtube.mode === 'channel' ? 'https://img.youtube.com/vi/' + video.id + '/sddefault.jpg' : video.img}
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

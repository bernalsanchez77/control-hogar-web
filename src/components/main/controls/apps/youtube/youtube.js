import { useRef, useEffect, useCallback } from 'react';
import { store } from "../../../../../store/store";
import ViewRouter from '../../../../../global/view-router';
import './youtube.css';
const viewRouter = new ViewRouter();

function Youtube({ changeControlParent, handleQueueParent, removeSelectedVideoParent }) {
  const youtubeSearchVideosSt = store(v => v.youtubeSearchVideosSt);
  const youtubeChannelsLizSt = store(v => v.youtubeChannelsLizSt);
  const youtubeVideosLizSt = store(v => v.youtubeVideosLizSt);
  const rokuAppsSt = store(v => v.rokuAppsSt);
  const rokuPlayStatePositionSt = store(v => v.rokuPlayStatePositionSt);
  const viewSt = store(v => v.viewSt);
  const timeout3s = useRef(null);
  const longClick = useRef(false);
  let youtubeSortedVideos = [];
  let youtubeSortedChannels = [];
  let touchMoved = false;
  let touchStartY = 0;
  const channelSelected = useRef('');
  const currentVideoRef = useRef(youtubeVideosLizSt.find(vid => vid.state === 'selected'));
  const rokuId = rokuAppsSt.find(app => app.id === 'youtube').rokuId;
  const normalizedPercentage = useRef(Math.min(100, Math.max(0, 0)));

  const changeView = (channel) => {
    localStorage.setItem('channelSelected', channel);
    channelSelected.current = channel;
    const newView = structuredClone(viewSt);
    newView.roku.apps.youtube.channel = channel;
    newView.roku.apps.youtube.mode = 'channel';
    viewRouter.changeView(newView);
  };

  const removeSelectedVideo = useCallback(() => {
    removeSelectedVideoParent(youtubeVideosLizSt);
  }, [youtubeVideosLizSt, removeSelectedVideoParent]);

  const getLastQueue = useCallback(() => {
    return youtubeVideosLizSt.reduce((maxObject, currentObject) => {
      const maxVal = maxObject['queue'];
      const currentVal = currentObject['queue'];
      if (currentVal > maxVal) {
        return currentObject;
      } else {
        return maxObject;
      }
    });
  }, [youtubeVideosLizSt]);

  const handleQueue = useCallback((video) => {
    if (video.queue) {
      handleQueueParent({ action: 'remove', videoId: video.id, queueNumber: 0, date: video.date });
    } else {
      const lastQueue = getLastQueue().queue;
      handleQueueParent({ action: 'add', videoId: video.id, queueNumber: lastQueue + 1, date: video.date });
    }
  }, [handleQueueParent, getLastQueue]);

  const changeControl = useCallback((video) => {
    const currentVideo = youtubeVideosLizSt.find(vid => vid.state === 'selected');
    if (currentVideo?.id !== video.id) {
      const device = 'rokuSala';
      changeControlParent({
        roku: [{ device, key: 'launch', value: rokuId, params: { contentID: video.id } }],
        massMedia: [{ device, key: 'video', value: video.id }],
      });
    }
  }, [changeControlParent, rokuId, youtubeVideosLizSt]);
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
    if (!touchMoved) {
      if (longClick.current) {
        console.log('long click');
        handleQueue(video);
      } else {
        if (type === 'channel') {
          changeView(video.id);
        }
        if (type === 'video') {
          changeControl(video);
        }
      }
    }
    longClick.current = false;
  };

  const timeToMs = (timeString) => {
    const parts = timeString.split(':');
    const numParts = parts.length;
    const MS_IN_SECOND = 1000;
    const MS_IN_MINUTE = 60 * MS_IN_SECOND; // 60,000
    const MS_IN_HOUR = 60 * MS_IN_MINUTE;   // 3,600,000
    let totalMilliseconds = 0;
    if (numParts === 3) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      const seconds = parseInt(parts[2], 10);
      totalMilliseconds = (hours * MS_IN_HOUR) + (minutes * MS_IN_MINUTE) + (seconds * MS_IN_SECOND);
    } else if (numParts === 2) {
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);
      totalMilliseconds = (minutes * MS_IN_MINUTE) + (seconds * MS_IN_SECOND);
    }
    return totalMilliseconds;
  };

  // const msToTime = (ms, includeHours = false) => {
  //   const MS_IN_SECOND = 1000;
  //   const MS_IN_MINUTE = 60 * MS_IN_SECOND;
  //   const MS_IN_HOUR = 60 * MS_IN_MINUTE;
  //   const hours = Math.floor(ms / MS_IN_HOUR);
  //   const minutes = Math.floor((ms % MS_IN_HOUR) / MS_IN_MINUTE);
  //   const seconds = Math.floor((ms % MS_IN_MINUTE) / MS_IN_SECOND);
  //   const formattedMinutes = String(minutes).padStart(2, '0');
  //   const formattedSeconds = String(seconds).padStart(2, '0');

  //   if (hours > 0 || includeHours) {
  //     const formattedHours = String(hours).padStart(2, '0');
  //     return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  //   } else {
  //     const totalMinutes = Math.floor(ms / MS_IN_MINUTE);
  //     const finalMinutes = String(totalMinutes).padStart(2, '0');
  //     return `${finalMinutes}:${formattedSeconds}`;
  //   }
  // };

  const getNextQueue = useCallback((currentQueue) => {
    const higherQueueVideos = youtubeVideosLizSt.filter(obj => {
      const propValue = Number(obj['queue']);
      return propValue > currentQueue;
    });
    if (higherQueueVideos.length === 0) {
      return null;
    }
    higherQueueVideos.sort((a, b) => {
      return Number(a.queue) - Number(b.queue);
    });
    return higherQueueVideos[0];
  }, [youtubeVideosLizSt]);

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

  useEffect(() => {
    if (currentVideoRef.current && currentVideoRef.current.id) {
      let currentVideoDuration = 0;
      if (currentVideoRef.current.duration) {
        currentVideoDuration = timeToMs(currentVideoRef.current.duration);
      }
      console.log('position:', rokuPlayStatePositionSt, 'duration:', currentVideoDuration);
      const timeLeft = currentVideoDuration - rokuPlayStatePositionSt;
      const percentage = (rokuPlayStatePositionSt * 100) / currentVideoDuration;
      normalizedPercentage.current = Math.round(Math.min(100, Math.max(0, (percentage))));
      // console.log(Math.min(100, Math.max(0, rokuPlayStatePositionSt)));
      console.log(normalizedPercentage.current);
      if (timeLeft && timeLeft < 6000) {
        console.log('terminando');
        const nextVideo = getNextQueue(currentVideoRef.current.queue);
        if (nextVideo) {
          changeControl(nextVideo);
          handleQueue(currentVideoRef.current);
        } else {
          removeSelectedVideo();
        }
      }
    }
  }, [rokuPlayStatePositionSt, changeControl, getNextQueue, handleQueue, removeSelectedVideo]);

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
                    <div className="progress-bar-container">
                      {currentVideoRef.current && currentVideoRef.current.id === video.id &&
                        <div className="progress-bar-track">
                          <div
                            className="progress-bar-fill" style={{ width: `${normalizedPercentage.current}%` }}>
                          </div>
                        </div>
                      }
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

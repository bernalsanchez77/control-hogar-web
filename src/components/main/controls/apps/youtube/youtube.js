import { useRef, useState } from 'react';
import { store } from "../../../../../store/store";
import viewRouter from '../../../../../global/view-router';
import youtube from '../../../../../global/youtube';
import utils from '../../../../../global/utils';
import requests from '../../../../../global/requests';
import './youtube.css';

function Youtube() {
  const youtubeSearchVideosSt = store(v => v.youtubeSearchVideosSt);
  const youtubeChannelsLizSt = store(v => v.youtubeChannelsLizSt);
  const youtubeVideosLizSt = store(v => v.youtubeVideosLizSt);
  const viewSt = store(v => v.viewSt);
  const leaderSt = store(v => v.leaderSt);
  const userNameSt = store(v => v.userNameSt);
  const lizEnabledSt = store(v => v.lizEnabledSt);
  const [savedChannel, setSavedChannel] = useState('');
  const [savedVideo, setSavedVideo] = useState('');
  const timeout3s = useRef(null);
  const longClick = useRef(false);
  const savedChannelRef = useRef('');
  let youtubeSortedVideos = [];
  let youtubeSortedChannels = [];
  let youtubeSortedQueue = [];
  let touchMoved = false;
  let touchStartY = 0;
  const channelSelected = useRef('');
  const selectionsSt = store(v => v.selectionsSt);
  const youtubeVideosLizSelectedId = selectionsSt.find(el => el.table === 'youtubeVideosLiz2').id;

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
      duration: utils.formatYoutubeDuration(item.contentDetails.duration),
    }));
  }
  if (viewSt.roku.apps.youtube.mode === 'queue') {
    youtubeSortedQueue = youtubeVideosLizSt.filter(video => video.queue > 0);
    youtubeSortedQueue = Object.values(youtubeSortedQueue).sort((a, b) => a.queue - b.queue);
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
        utils.triggerVibrate();
        youtube.handleQueue(video);
      } else {
        if (type === 'channel') {
          utils.triggerVibrate();
          onChannelShortClick(video.id);
        }
        if (type === 'video') {
          if (leaderSt) {
            utils.triggerVibrate();
            youtube.onVideoShortClick(video);
          }
        }
        if (type === 'options') {
          utils.triggerVibrate();
          setSavedVideo(video);
          const newView = structuredClone(viewSt);
          newView.roku.apps.youtube.mode = 'options';
          viewRouter.changeView(newView);
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

  const addSavedChannel = (channel) => {
    setSavedChannel(channel);
    savedChannelRef.current = channel;
  };

  const saveSavedChannel = () => {
    utils.triggerVibrate();
    requests.upsertTable({ id: savedChannelRef.current, table: 'youtubeChannelsLiz', title: savedChannelRef.current, user: lizEnabledSt ? 'elizabeth' : userNameSt, date: null });
    requests.upsertTable({ id: savedVideo.id, table: 'youtubeVideosLiz', title: utils.decodeYoutubeTitle(savedVideo.title), duration: savedVideo.duration, channelId: savedChannelRef.current });
  };

  return (
    <div>
      {viewSt.roku.apps.youtube.mode === '' &&
        <div className='controls-apps-youtube'>
          <ul className='controls-apps-youtube-ul'>
            {
              youtubeSortedChannels.map((channel, key) => (
                (channel.user === userNameSt || (lizEnabledSt && channel.user === 'elizabeth')) &&
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
                    className={`controls-apps-youtube-video-button ${video.id === youtubeVideosLizSelectedId ? 'controls-apps-youtube-video-button--selected' : ''}`}
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
                  </button>
                  <p className='controls-apps-youtube-video-title'>
                    {video.title}
                  </p>
                  <div className='controls-apps-youtube-video-options-container'>
                    <p className='controls-apps-youtube-video-duration'>
                      {video.duration}
                    </p>
                    {/* <button
                      className={`controls-apps-youtube-video-options`}
                      onTouchStart={(e) => onTouchStart(e)}
                      onTouchMove={(e) => onTouchMove(e)}
                      onTouchEnd={(e) => onTouchEnd(e, 'options', video)}>
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        width="16">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M3.2 2.6666666666666665c0 -0.29454933333333333 0.238784 -0.5333333333333333 0.5333333333333333 -0.5333333333333333h8.533333333333333c0.2945066666666667 0 0.5333333333333333 0.238784 0.5333333333333333 0.5333333333333333v11.733333333333333c0 0.19391999999999998 -0.10517333333333333 0.37248000000000003 -0.2747733333333333 0.46645333333333333 -0.1696 0.09397333333333333 -0.3768533333333333 0.08853333333333334 -0.5412266666666666 -0.014186666666666665L8 12.36224 4.016 14.852266666666665c-0.16440533333333332 0.10271999999999999 -0.3716373333333333 0.10816 -0.5412053333333334 0.014186666666666665C3.305216 14.77248 3.2 14.59392 3.2 14.4v-11.733333333333333ZM4.266666666666667 3.2v10.23776l3.168 -1.9800533333333334c0.345888 -0.21610666666666667 0.7847786666666666 -0.21610666666666667 1.1306666666666667 0L11.733333333333333 13.437759999999999V3.2H4.266666666666667Z"
                          fill="#fff"
                          stroke-width="1.0667">
                        </path>
                      </svg>
                    </button> */}
                  </div>
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
                    className={`controls-apps-youtube-video-button ${video.id === youtubeVideosLizSelectedId ? 'controls-apps-youtube-video-button--selected' : ''}`}
                    onTouchStart={(e) => onTouchStart(e)}
                    onTouchMove={(e) => onTouchMove(e)}
                    onTouchEnd={(e) => onTouchEnd(e, 'video', video)}>
                    <img
                      className='controls-apps-youtube-video-img'
                      src={viewSt.roku.apps.youtube.mode === 'channel' ? 'https://img.youtube.com/vi/' + video.id + '/sddefault.jpg' : video.img}
                      alt="icono">
                    </img>
                  </button>
                  <p className='controls-apps-youtube-video-title'>
                    {video.title}
                  </p>
                  <div className='controls-apps-youtube-video-options-container'>
                    <p className='controls-apps-youtube-video-duration'>
                      {video.duration}
                    </p>
                    <button
                      className={`controls-apps-youtube-video-options`}
                      onTouchStart={(e) => onTouchStart(e)}
                      onTouchMove={(e) => onTouchMove(e)}
                      onTouchEnd={(e) => onTouchEnd(e, 'options', video)}>
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20"
                        width="20">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M3.2 2.6666666666666665c0 -0.29454933333333333 0.238784 -0.5333333333333333 0.5333333333333333 -0.5333333333333333h8.533333333333333c0.2945066666666667 0 0.5333333333333333 0.238784 0.5333333333333333 0.5333333333333333v11.733333333333333c0 0.19391999999999998 -0.10517333333333333 0.37248000000000003 -0.2747733333333333 0.46645333333333333 -0.1696 0.09397333333333333 -0.3768533333333333 0.08853333333333334 -0.5412266666666666 -0.014186666666666665L8 12.36224 4.016 14.852266666666665c-0.16440533333333332 0.10271999999999999 -0.3716373333333333 0.10816 -0.5412053333333334 0.014186666666666665C3.305216 14.77248 3.2 14.59392 3.2 14.4v-11.733333333333333ZM4.266666666666667 3.2v10.23776l3.168 -1.9800533333333334c0.345888 -0.21610666666666667 0.7847786666666666 -0.21610666666666667 1.1306666666666667 0L11.733333333333333 13.437759999999999V3.2H4.266666666666667Z"
                          fill="#fff"
                          stroke-width="1.0667">
                        </path>
                      </svg>
                    </button>
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
      }
      {(viewSt.roku.apps.youtube.mode === 'options') &&
        <div className='controls-apps-youtube controls-apps-youtube--options'>
          <div className='controls-apps-youtube-save-channel-input'>
            <input
              type="text"
              placeholder='Nombre del canal'
              onChange={(e) => addSavedChannel(e.target.value)}
              value={savedChannel}>
            </input>
          </div>
          <button
            className='controls-apps-youtube-save-channel-button'
            onClick={saveSavedChannel}>
            Guardar
          </button>
        </div>
      }
      {(viewSt.roku.apps.youtube.mode === 'queue') &&
        <div className='controls-apps-youtube controls-apps-youtube--channel'>
          <ul className='controls-apps-youtube-ul'>
            {
              youtubeSortedQueue.map((video, key) => (
                <li key={key} className='controls-apps-youtube-li-channel'>
                  <button
                    className={`controls-apps-youtube-video-button ${video.id === youtubeVideosLizSelectedId ? 'controls-apps-youtube-video-button--selected' : ''}`}
                    onTouchStart={(e) => onTouchStart(e)}
                    onTouchMove={(e) => onTouchMove(e)}
                    onTouchEnd={(e) => onTouchEnd(e, 'video', video)}>
                    <div>
                      <img
                        className={`controls-apps-youtube-video-img ${video.queue > 0 ? 'controls-apps-youtube-video-img--queue' : ''}`}
                        src={viewSt.roku.apps.youtube.mode === 'queue' ? video.img || 'https://img.youtube.com/vi/' + video.id + '/sddefault.jpg' : video.img}
                        alt="icono">
                      </img>
                      <div className='controls-apps-youtube-video-queue-number'>
                        <span>{getQueueConsecutiveNumber(video) || ''}</span>
                      </div>
                    </div>
                  </button>
                  <p className='controls-apps-youtube-video-title'>
                    {video.title}
                  </p>
                  <div className='controls-apps-youtube-video-options-container'>
                    <p className='controls-apps-youtube-video-duration'>
                      {video.duration}
                    </p>
                    <button
                      className={`controls-apps-youtube-video-options`}
                      onTouchStart={(e) => onTouchStart(e)}
                      onTouchMove={(e) => onTouchMove(e)}
                      onTouchEnd={(e) => onTouchEnd(e, 'options', video)}>
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20"
                        width="20">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M3.2 2.6666666666666665c0 -0.29454933333333333 0.238784 -0.5333333333333333 0.5333333333333333 -0.5333333333333333h8.533333333333333c0.2945066666666667 0 0.5333333333333333 0.238784 0.5333333333333333 0.5333333333333333v11.733333333333333c0 0.19391999999999998 -0.10517333333333333 0.37248000000000003 -0.2747733333333333 0.46645333333333333 -0.1696 0.09397333333333333 -0.3768533333333333 0.08853333333333334 -0.5412266666666666 -0.014186666666666665L8 12.36224 4.016 14.852266666666665c-0.16440533333333332 0.10271999999999999 -0.3716373333333333 0.10816 -0.5412053333333334 0.014186666666666665C3.305216 14.77248 3.2 14.59392 3.2 14.4v-11.733333333333333ZM4.266666666666667 3.2v10.23776l3.168 -1.9800533333333334c0.345888 -0.21610666666666667 0.7847786666666666 -0.21610666666666667 1.1306666666666667 0L11.733333333333333 13.437759999999999V3.2H4.266666666666667Z"
                          fill="#fff"
                          stroke-width="1.0667">
                        </path>
                      </svg>
                    </button>
                  </div>
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

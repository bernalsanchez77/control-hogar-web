import React, {useRef, useState} from 'react';
import './devices.css';

function Devices({devicesState, deviceState, youtubeSearchVideos, youtubeLizVideos, searchMode, triggerControlParent, triggerDeviceStateParent, searchYoutubeParent}) {
  let youtubeLizSortedVideos = [];
  let youtubeLizSortedChannels = [];
  const channelSelected = useRef('');
  const [youtubeSearchText, setYoutubeSearchText] = useState('');
  const triggerDevice = (color) => {
    const device = devicesState[deviceState].id;
    if (devicesState[deviceState].state === 'off') {
      triggerControlParent({ifttt: [{device, key: 'state', value: 'on'}]});
    }
    setTimeout(() => {
      triggerControlParent({ifttt: [{device, key: 'color', value: color}]});
    }, 1000);
  };
  const triggerYoutubeChannel = (state, channel) => {
    channelSelected.current = channel;
    triggerDeviceStateParent(state);
  };
  const triggerYoutubeVideo = (video) => {
    const device = 'rokuSala';
    triggerControlParent({
      roku: [{device, key: 'launch', value: devicesState.rokuSala.apps.youtube.rokuId, params: {contentID: video}}],
      massMedia: [{device: device, key: 'video', value: video}],
    });
  };
  if (deviceState === 'youtube') {
    searchMode.current = false;
    const refMap = {};
    youtubeLizVideos.current.forEach(video => {
      refMap[video.channelId] = {
        channelId: video.channelId,
        channelOrder: video.channelOrder,
        channelImg: video.channelImg
      }
    });
    youtubeLizSortedChannels = Object.values(refMap).sort((a, b) => a.channelOrder - b.channelOrder);
  }
  if (deviceState === 'youtubeVideos') {
    if (searchMode.current) {
      youtubeLizSortedVideos = youtubeSearchVideos.current.map(item => ({
        videoId: item.id.videoId,
        videoTitle: item.snippet.title,
        videoDescription: item.snippet.description,
        videoImg: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
      }));
    } else {
      youtubeLizSortedVideos = youtubeLizVideos.current.filter(video => video.channelId === channelSelected.current);
      youtubeLizSortedVideos = Object.values(youtubeLizSortedVideos).sort(
        (a, b) => new Date(a.videoDate) - new Date(b.videoDate)
      );
    }
  }

  return (
    <div>
      {deviceState === 'luzCuarto' &&
      <div className='controls-devices'>
        <ul className='controls-devices-ul'>
          <li className='controls-device'>
              <button
                className={`controls-device-luzcuarto-button controls-device-luzcuarto-button--white ${devicesState[deviceState].color === 'white' ? 'controls-device-luzcuarto-button--selected' : ''}`}
                onTouchStart={() => triggerDevice('white')}>
              </button>
          </li>
          <li className='controls-device'>
              <button
                className={`controls-device-luzcuarto-button controls-device-luzcuarto-button--red ${devicesState[deviceState].color === 'red' ? 'controls-device-luzcuarto-button--selected' : ''}`}
                onTouchStart={() => triggerDevice('red')}>
              </button>
          </li>
        </ul>
      </div>
      }
      {deviceState === 'youtube' &&
      <div className='controls-devices'>
        <ul className='controls-devices-ul'>
          {
            youtubeLizSortedChannels.map((channel, key) => (
            <li key={key} className='controls-device'>
              <button
                className={'controls-device-youtube-channel-button'}
                onTouchStart={() => triggerYoutubeChannel('youtubeVideos', channel.channelId)}>
                <img
                  className='controls-device-youtube-channel-img'
                  src={channel.channelImg}
                  alt="icono">
                </img>
              </button>
            </li>
            ))
          }
        </ul>
      </div>
      }
      {deviceState === 'youtubeVideos' &&
      <div className='controls-devices'>
        <ul className='controls-devices-ul'>
          {
            youtubeLizSortedVideos.map((video, key) => (
            <li key={key} className='controls-device'>
              <button
                className={`controls-device-youtube-video-button ${devicesState.rokuSala.video === video.videoId ? 'controls-device-youtube-video-button--selected' : ''}`}
                onTouchStart={() => triggerYoutubeVideo(video.videoId)}>
                <img
                  className='controls-device-youtube-video-img'
                  src={video.videoImg}
                  alt="icono">
                </img>
                <p className='controls-device-youtube-video-title'>
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

export default Devices;

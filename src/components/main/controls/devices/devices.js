import React, {useRef, useState} from 'react';
import './devices.css';

function Devices({devicesState, deviceState, youtubeSearchVideos, youtubeLizVideos, triggerControlParent, triggerDeviceStateParent, searchYoutubeParent}) {
  let youtubeLizSortedVideos = [];
  let youtubeLizSortedChannels = [];
  const channelSelected = useRef('');
  const searchMode = useRef(false);
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
  const searchYoutube = () => {
    searchMode.current = true;
    triggerDeviceStateParent('youtubeVideos');
    searchYoutubeParent(youtubeSearchText);
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
      console.log('test');
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
        <div>
          <input
            type="text"
            placeholder="Search YouTube videos"
            value={youtubeSearchText}
            onChange={e => setYoutubeSearchText(e.target.value)}>
          </input>
          <button onClick={searchYoutube}>Search</button>
        </div>
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
              {searchMode === true ?
              <button
                className={`controls-device-youtube-video-button ${devicesState.rokuSala.video === video.videoId ? 'controls-device-youtube-video-button--selected' : ''}`}
                onTouchStart={() => triggerYoutubeVideo(video.videoId)}>
                <img
                  className='controls-device-youtube-video-img'
                  src={video.videoImg}
                  alt="icono">
                </img>
              </button>
              :
              <button
                className={'controls-device-youtube-video-button'}
                onTouchStart={() => triggerYoutubeVideo(video.videoId)}>
                <img
                  className='controls-device-youtube-video-img'
                  src={video.videoImg}
                  alt="icono">
                </img>
              </button>
              }
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

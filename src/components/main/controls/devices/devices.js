import React, {useRef} from 'react';
import './devices.css';

function Devices({devicesState, deviceState, youtubeLizVideos, triggerControlParent, triggerDeviceStateParent}) {
  let youtubeLizSortedVideos = [];
  let youtubeLizSortedChannels = [];
  const channelSelected = useRef('');
  const triggerDevice = (color) => {
    const device = devicesState[deviceState].id;
    if (devicesState[deviceState].state === 'off') {
      triggerControlParent({ifttt: [{device, key: 'state', value: 'on'}]});
    }
    setTimeout(() => {
      triggerControlParent({ifttt: [{device, key: 'color', value: color}]});
    }, 1000);
  }
  const triggerYoutubeChannel = (state, channel) => {
    channelSelected.current = channel;
    triggerDeviceStateParent(state);
  }
  const triggerYoutubeVideo = (video) => {
    const device = 'rokuSala';
    triggerControlParent({
      roku: [{device, key: 'launch', value: devicesState.rokuSala.apps.youtube.rokuId, params: {contentID: video}}],
      massMedia: [{device: device, key: 'video', value: video}],
    });
  }

  if (deviceState === 'youtube') {
    const refMap = {};
    youtubeLizVideos.forEach(video => {
      refMap[video.channelId] = {
        channelId: video.channelId,
        channelOrder: video.channelOrder,
        channelImg: video.channelImg
      }
    });
    youtubeLizSortedChannels = Object.values(refMap).sort((a, b) => a.order - b.order);
  }

  if (deviceState === 'youtubeVideos') {
    youtubeLizSortedVideos = youtubeLizVideos.filter(video => video.channelId === channelSelected.current);
    youtubeLizSortedVideos = Object.values(youtubeLizSortedVideos).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
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

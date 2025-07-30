import './devices.css';

function Devices({devicesState, deviceState, triggerControlParent}) {
  const triggerDevice = (color) => {
    const device = devicesState[deviceState].id;
    if (devicesState[deviceState].state === 'off') {
      triggerControlParent({ifttt: [{device, key: 'state', value: 'on'}]});
    }
    setTimeout(() => {
      triggerControlParent({ifttt: [{device, key: 'color', value: color}]});
    }, 1000);
  }
  const triggerYoutube = (video) => {
    const device = 'rokuSala';
    triggerControlParent({
      roku: [{device, key: 'launch', value: devicesState.rokuSala.apps.youtube.rokuId, params: {contentID: video}}],
      massMedia: [{device: device, key: 'video', value: video}],
    });
  }
  const sortedVideos = Object.values(devicesState.rokuSala.apps.youtube.videos.liz).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

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
            sortedVideos.map((video, key) => (
            <li key={key} className='controls-device'>
              <button
                className={`controls-device-youtube-button ${devicesState.rokuSala.video === video.yid ? 'controls-device-youtube-button--selected' : ''}`}
                onTouchStart={() => triggerYoutube(video.yid)}>
                <img
                  className='controls-device-youtube-img'
                  src={video.img}
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

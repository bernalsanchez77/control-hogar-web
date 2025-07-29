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
    //triggerControlParent({ifttt: [{device, key: 'color', value: color}]});
  }

  return (
    <div>
      {deviceState === 'luzCuarto' &&
      <div className='controls-devices'>
        <ul className='controls-devices-ul'>
          <li className='controls-device'>
              <button
                className={`controls-device-button controls-device-button--white ${devicesState[deviceState].color === 'white' ? 'controls-device-button--selected' : ''}`}
                onTouchStart={() => triggerDevice('white')}>
              </button>
          </li>
          <li className='controls-device'>
              <button
                className={`controls-device-button controls-device-button--red ${devicesState[deviceState].color === 'red' ? 'controls-device-button--selected' : ''}`}
                onTouchStart={() => triggerDevice('red')}>
              </button>
          </li>
        </ul>
      </div>
      }
      {deviceState === 'youtube' &&
      <div className='controls-devices'>
        <ul className='controls-devices-ul'>
          <li className='controls-device'>
              <button
                className={`controls-device-button controls-device-button--white`}
                onTouchStart={() => triggerYoutube('ebiDCZSGVEw')}>
                  Calliou
              </button>
          </li>
          <li className='controls-device'>
              <button
                className={`controls-device-button controls-device-button--red`}
                onTouchStart={() => triggerYoutube('ebiDCZSGVEw')}>
                  Otra
              </button>
          </li>
        </ul>
      </div>
      }
    </div>
  )
}

export default Devices;

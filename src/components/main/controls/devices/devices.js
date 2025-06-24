import React from 'react';
import './devices.css';

function Devices({devicesState, deviceState, triggerControlParent}) {
  const triggerDevice = (color) => {
    const device = [{device: devicesState.luzCuarto.id, ifttt: devicesState.luzCuarto.id}];
    if (deviceState.luzCuarto.state === 'off') {
      triggerControlParent(device, ['state'], ['on']);
    }
    setTimeout(() => {
      triggerControlParent(device, ['color'], [color], true);
    }, 2000);
  }

  return (
    <div>
      {deviceState == 'luzCuarto' &&
      <div className='controls-devices'>
        <ul className='controls-devices-ul'>
          <li className='controls-device'>
              <button
                className={`controls-device-button controls-device-button--white ${devicesState.luzCuarto.color === 'white' ? 'controls-device-button--selected' : ''}`}
                onTouchStart={() => triggerDevice('white')}>
              </button>
          </li>
          <li className='controls-device'>
              <button
                className={`controls-device-button controls-device-button--red ${devicesState.luzCuarto.color === 'red' ? 'controls-device-button--selected' : ''}`}
                onTouchStart={() => triggerDevice('red')}>
              </button>
          </li>
        </ul>
      </div>
      }
    </div>
  )
}

export default Devices;

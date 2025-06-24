import React from 'react';
import './devices.css';

function Devices({devicesState, deviceState, triggerControlParent}) {
  const triggerDevice = (color) => {
    const device = [{device: devicesState[deviceState].id, ifttt: devicesState[deviceState].id}];
    if (devicesState[deviceState].state === 'off') {
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
    </div>
  )
}

export default Devices;

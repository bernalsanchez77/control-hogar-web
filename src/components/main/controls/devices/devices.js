import React from 'react';
import './devices.css';

function Devices({devicesState, deviceState, triggerControlParent, triggerDeviceStateParent}) {
  const triggerDevice = (color) => {
    const device = [{device: devicesState.luzCuarto.id, ifttt: devicesState.luzCuarto.id}];
    triggerControlParent(device, ['color'], [color], true);
  }

  return (
    <div>
      {deviceState == 'luzCuarto' &&
      <div className='controls-devices'>
        <ul className='controls-devices-ul'>
          <li className='controls-device'>
              <button
                className='controls-device-button controls-device-button--white'
                onTouchStart={() => triggerDevice('white')}>
              </button>
          </li>
          <li className='controls-device'>
              <button
                className='controls-device-button controls-device-button--red'
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

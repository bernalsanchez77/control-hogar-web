import React from 'react';
import './screen.css';

function Screen({credential, ownerCredential, inRange, devicesState, loadingDevices, changeDeviceParent}) {
  const triggerDevice = (device, key, value) => {
    if (inRange || (credential === ownerCredential)) {
      if (!loadingDevices.current) {
        changeDeviceParent(device, key, value);
      } else {
        setTimeout(() => {
            triggerDevice(device, key, value);
        }, 1000);
      }
    }
  }

  return (
    <div>
      <div className='screen'>
        <div className='screen-row'>
          {credential === 'owner' &&
          <div className='screen-element'>
            <button onContextMenu={(e) => e.preventDefault()} className={`devices-button ${devicesState.teleCuarto.state === 'on' ? "screen-button--on" : "screen-button-off"}`} onClick={() => triggerDevice(devicesState.teleCuarto.id)}>{devicesState.teleCuarto.label}</button>
          </div>
          }
          <div className='screen-element'>
            <button className='screen-button'>Sala</button>
            </div>
          <div className='screen-element'>
            <button className='screen-button'>Proyector</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Screen;

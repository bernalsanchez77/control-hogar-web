import React from 'react';
import './controls.css';

function Controls({credential, ownerCredential, inRange, devicesState, loadingDevices, changeDeviceParent, controlSelected}) {
  const triggerDeviceParent = (device, key, value) => {
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
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerDeviceParent(device, 'state', 'off');
    }
    if (devicesState[device].state === 'off') {
      triggerDeviceParent(device, 'state', 'on');
    }
  }
  return (
    <div>
      <div className='controls'>
        <div className='controls-row'>
          <div className='controls-element'>
            <button onContextMenu={(e) => e.preventDefault()} className={`controls-button ${devicesState.teleCuarto.state === 'on' ? "controls-button--on" : "controls-button-off"}`} onClick={() => triggerDevice(devicesState.teleCuarto.id)}>{devicesState.teleCuarto.state}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Controls;

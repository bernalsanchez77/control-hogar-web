import React from 'react';
import './screens.css';

function Screens({credential, ownerCredential, inRange, devicesState, loadingDevices, changeDeviceParent, controlSelected, changeControlParent}) {
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
  const triggerControl = (control) => {
    if (controlSelected !== control) {
      changeControlParent(control);
    }
  }
  return (
    <div>
      <div className='screens'>
        <div className='screens-row'>
          {credential === 'owner' &&
          <div className='screens-element'>
            <button onContextMenu={(e) => e.preventDefault()} className={`screens-button ${controlSelected === devicesState.teleCuarto.id ? "screens-button--on" : "screens-button-off"}`} onClick={() => triggerControl(devicesState.teleCuarto.id)}>{devicesState.teleCuarto.label}</button>
          </div>
          }
          <div className='screens-element'>
          <button onContextMenu={(e) => e.preventDefault()} className={`screens-button ${controlSelected === devicesState.teleSala.id ? "screens-button--on" : "screens-button-off"}`} onClick={() => triggerControl(devicesState.teleSala.id)}>{devicesState.teleSala.label}</button>
            </div>
          <div className='screens-element'>
          <button onContextMenu={(e) => e.preventDefault()} className={`screens-button ${controlSelected === devicesState.proyectorSala.id ? "screens-button--on" : "screens-button-off"}`} onClick={() => triggerControl(devicesState.proyectorSala.id)}>{devicesState.proyectorSala.label}</button>
          </div>
          <div className='screens-element'>
            <button onContextMenu={(e) => e.preventDefault()} className={`screens-button ${devicesState.teleCuarto.state === 'on' ? "screens-button--on" : "screens-button-off"}`} onClick={() => triggerDevice(devicesState.teleCuarto.id)}>{devicesState.teleCuarto.label}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Screens;

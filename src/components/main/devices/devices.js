import React from 'react';
import './devices.css';

function Devices({inRange, devicesState, loadingDevices, changeDeviceParent}) {
  const triggerDevice = (device, state) => {

    if (inRange) { 
        if (!state) {
            state = devicesState[device].state;
        }
        if (!loadingDevices.current) {
            if (state === 'on') {
                changeDeviceParent(device, 'off');
            }
            if (state === 'off') {
                changeDeviceParent(device, 'on');
            }
            if (state === 'roku') {
                changeDeviceParent(device, 'cable');
            }
            if (state === 'cable') {
                changeDeviceParent(device, 'roku');
            }
        } else {
            setTimeout(() => {
                triggerDevice(device, state);
            }, 1000);
        }
    } else {
        alert('fuera del area permitida');
    }
  }

  return (
    <div className="devices">
      <div>
        <button className='devices-button' onClick={() => triggerDevice(devicesState.lamparaComedor.id)}>{devicesState.lamparaComedor.label} {devicesState.lamparaComedor.state}</button>
      </div>
      <div>
        <button className='devices-button' onClick={() => triggerDevice(devicesState.lamparaTurca.id)}>{devicesState.lamparaTurca.label} {devicesState.lamparaTurca.state}</button>
      </div>
      <div>
        <button className='devices-button' onClick={() => triggerDevice(devicesState.lamparaSala.id)}>{devicesState.lamparaSala.label} {devicesState.lamparaSala.state}</button>
      </div>
      <div>
        <button className='devices-button' onClick={() => triggerDevice(devicesState.chimenea.id)}>{devicesState.chimenea.label} {devicesState.chimenea.state}</button>
      </div>
      <div>
        <button className='devices-button' onClick={() => triggerDevice(devicesState.parlantesSala.id)}>{devicesState.parlantesSala.label} {devicesState.parlantesSala.state}</button>
      </div>
      <div>
        <button className='devices-button' onClick={() => triggerDevice(devicesState.hdmi.id)}>{devicesState.hdmi.label} {devicesState.hdmi.state}</button>
      </div>
    </div>
  );
}

export default Devices;

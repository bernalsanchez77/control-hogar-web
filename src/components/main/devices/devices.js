import React from 'react';
import LamparaComedor from './lamparaComedor/lamparaComedor';
import LamparaTurca from './lamparaTurca/lamparaTurca';
import './devices.css';

function Devices({credential, ownerCredential, inRange, devicesState, loadingDevices, changeDeviceParent}) {
  const triggerDevice = (device, state) => {

    if (inRange || (credential === ownerCredential)) {
      if (!loadingDevices.current) {
        changeDeviceParent(device, state);
          // if (state === 'on') {
          //     changeDeviceParent(device, 'off');
          // }
          // if (state === 'off') {
          //     changeDeviceParent(device, 'on');
          // }
          // if (state === 'roku') {
          //     changeDeviceParent(device, 'cable');
          // }
          // if (state === 'cable') {
          //     changeDeviceParent(device, 'roku');
          // }
      } else {
        setTimeout(() => {
            triggerDevice(device, state);
        }, 1000);
      }
    }
  }

  return (
    <div className="devices">
      <div className='devices-row'>
        <div className='devices-element'>
          <LamparaComedor
            devicesState={devicesState}
            triggerDeviceParent={triggerDevice}>
          </LamparaComedor>
        </div>
        <div className='devices-element'>
          <LamparaTurca
            devicesState={devicesState}
            triggerDeviceParent={triggerDevice}>
          </LamparaTurca>
        </div>
        <div className='devices-element'>
          <button className='devices-button' onClick={() => triggerDevice(devicesState.lamparaSala.id)}>{devicesState.lamparaSala.label} {devicesState.lamparaSala.state}</button>
        </div>
        <div className='devices-element'>
          <button className='devices-button' onClick={() => triggerDevice(devicesState.chimenea.id)}>{devicesState.chimenea.label} {devicesState.chimenea.state}</button>
        </div>
        <div className='devices-element'>
          <button className='devices-button' onClick={() => triggerDevice(devicesState.parlantesSala.id)}>{devicesState.parlantesSala.label} {devicesState.parlantesSala.state}</button>
        </div>
      </div>
      <div className='devices-row'>
        <div className='devices-element'>
          <button className='devices-button' onClick={() => triggerDevice(devicesState.hdmi.id)}>{devicesState.hdmi.label} {devicesState.hdmi.state}</button>
        </div>
      </div>
    </div>
  );
}

export default Devices;

import React from 'react';
import LamparaComedor from './lamparaComedor/lamparaComedor';
import LamparaTurca from './lamparaTurca/lamparaTurca';
import LamparaSala from './lamparaSala/lamparaSala';
import ChimeneaSala from './chimeneaSala/chimeneaSala';
import ParlantesSala from './parlantesSala/parlantesSala';
import HdmiSala from './hdmiSala/hdmiSala';
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
          <LamparaSala
            devicesState={devicesState}
            triggerDeviceParent={triggerDevice}>
          </LamparaSala>
        </div>
        <div className='devices-element'>
          <ChimeneaSala
            devicesState={devicesState}
            triggerDeviceParent={triggerDevice}>
          </ChimeneaSala>
        </div>
        <div className='devices-element'>
          <ParlantesSala
            devicesState={devicesState}
            triggerDeviceParent={triggerDevice}>
          </ParlantesSala>
        </div>
      </div>
      <div className='devices-row'>
        <div className='devices-element'>
          <HdmiSala
            devicesState={devicesState}
            triggerDeviceParent={triggerDevice}>
          </HdmiSala>
        </div>
      </div>
    </div>
  );
}

export default Devices;

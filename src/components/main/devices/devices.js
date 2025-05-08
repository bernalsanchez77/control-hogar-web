import React from 'react';
import LamparaComedor from './lamparaComedor/lamparaComedor';
import LamparaTurca from './lamparaTurca/lamparaTurca';
import LamparaSala from './lamparaSala/lamparaSala';
import LamparaRotatoria from './lamparaRotatoria/lamparaRotatoria';
import ChimeneaSala from './chimeneaSala/chimeneaSala';
import ParlantesSala from './parlantesSala/parlantesSala';
import HdmiSala from './hdmiSala/hdmiSala';
import CalentadorNegro from './calentadorNegro/calentadorNegro';
import CalentadorBlanco from './calentadorBlanco/calentadorBlanco';
import './devices.css';
import LamparasAbajo from './lamparasAbajo/lamparasAbajo';

function Devices({credential, ownerCredential, inRange, devicesState, loadingDevices, changeDeviceParent}) {
  console.log(ownerCredential);
  const triggerDevice = (device, change, nuevo) => {
    if (inRange || (credential === ownerCredential)) {
      if (!loadingDevices.current) {
        changeDeviceParent(device, change, nuevo);
      } else {
        setTimeout(() => {
            triggerDevice(device, change, nuevo);
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
          <LamparaRotatoria
            devicesState={devicesState}
            triggerDeviceParent={triggerDevice}>
          </LamparaRotatoria>
        </div>
        <div className='devices-element'>
          <ChimeneaSala
            devicesState={devicesState}
            triggerDeviceParent={triggerDevice}>
          </ChimeneaSala>
        </div>
      </div>
      <div className='devices-row'>
        <div className='devices-element'>
          <HdmiSala
            devicesState={devicesState}
            triggerDeviceParent={triggerDevice}>
          </HdmiSala>
        </div>
        <div className='devices-element'>
          <ParlantesSala
            devicesState={devicesState}
            triggerDeviceParent={triggerDevice}>
          </ParlantesSala>
        </div>
        {credential === ownerCredential &&
        <div className='devices-element'>
          <CalentadorNegro
            devicesState={devicesState}
            triggerDeviceParent={triggerDevice}>
          </CalentadorNegro>
        </div>
        }
        {credential === ownerCredential &&
        <div className='devices-element'>
          <CalentadorBlanco
            devicesState={devicesState}
            triggerDeviceParent={triggerDevice}>
          </CalentadorBlanco>
        </div>
        }
        <div className='devices-element'>
          <LamparasAbajo
            devicesState={devicesState}
            triggerDeviceParent={triggerDevice}>
          </LamparasAbajo>
        </div>
      </div>
    </div>
  );
}

export default Devices;

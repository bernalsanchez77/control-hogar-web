import React from 'react';
import './lamparaComedor.css';

function LamparaComedor({inRange, devicesState, loadingDevices, changeDeviceParent}) {
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
    <div className="lamparaComedor">
      <div>
        <button className='devices-button' onClick={() => triggerDevice(devicesState.lamparaComedor.id)}>{devicesState.lamparaComedor.label} {devicesState.lamparaComedor.state}</button>
      </div>
    </div>
  );
}

export default LamparaComedor;

import React from 'react';
import './lamparaComedor.css';

function LamparaComedor({devicesState, triggerDeviceParent}) {
  const triggerDevice = (device, state) => {
    if (state === 'on') {
      triggerDeviceParent(device, 'off');
    }
    if (state === 'off') {
      triggerDeviceParent(device, 'on');
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

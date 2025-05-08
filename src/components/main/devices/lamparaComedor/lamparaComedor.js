import React from 'react';
import './lamparaComedor.css';

function LamparaComedor({devicesState, triggerDeviceParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerDeviceParent(device, 'state', 'off');
    }
    if (devicesState[device].state === 'off') {
      triggerDeviceParent(device, 'state', 'on');
    }
  }

  return (
    <div className="lamparaComedor">
      <div>
        <button className={`devices-button ${devicesState.lamparaComedor.state === 'on' ? "devices-button--on" : "devices-button-off"}`} onClick={() => triggerDevice(devicesState.lamparaComedor.id)}>{devicesState.lamparaComedor.label}</button>
      </div>
    </div>
  );
}

export default LamparaComedor;

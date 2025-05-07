import React from 'react';
import './lamparaRotatoria.css';

function LamparaRotatoria({devicesState, triggerDeviceParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerDeviceParent(device, 'off');
    }
    if (devicesState[device].state === 'off') {
      triggerDeviceParent(device, 'on');
    }
  }

  return (
    <div className="lamparaRotatoria">
      <div>
        <button className={`devices-button ${devicesState.lamparaRotatoria.state === 'on' ? "devices-button--on" : "devices-button-off"}`} onClick={() => triggerDevice(devicesState.lamparaRotatoria.id)}>{devicesState.lamparaRotatoria.label}</button>
      </div>
    </div>
  );
}

export default LamparaRotatoria;

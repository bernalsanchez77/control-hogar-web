import React from 'react';
import './luzEscalera.css';

function LuzEscalera({devicesState, triggerDeviceParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerDeviceParent([device], ['state'], ['off']);
    }
    if (devicesState[device].state === 'off') {
      triggerDeviceParent([device], ['state'], ['on']);
    }
  }

  return (
    <div className="luzEscalera">
      <div>
        <button className={`devices-button ${devicesState.LuzEscalera.state === 'on' ? "devices-button--on" : "devices-button-off"}`} onClick={() => triggerDevice(devicesState.LuzEscalera.id)}>{devicesState.LuzEscalera.label}</button>
      </div>
    </div>
  );
}

export default LuzEscalera;

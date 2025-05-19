import React from 'react';
import './luzCuarto.css';

function LuzCuarto({devicesState, triggerDeviceParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerDeviceParent([device], ['state'], ['off']);
    }
    if (devicesState[device].state === 'off') {
      triggerDeviceParent([device], ['state'], ['on']);
    }
  }

  return (
    <div className="luzCuarto">
      <div>
        <button className={`devices-button ${devicesState.luzCuarto.state === 'on' ? "devices-button--on" : "devices-button-off"}`} onClick={() => triggerDevice(devicesState.luzCuarto.id)}>{devicesState.luzCuarto.label}</button>
      </div>
    </div>
  );
}

export default LuzCuarto;

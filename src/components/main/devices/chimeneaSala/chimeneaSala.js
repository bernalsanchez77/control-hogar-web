import React from 'react';
import './chimeneaSala.css';

function ChimeneaSala({devicesState, triggerDeviceParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerDeviceParent(device, 'off');
    }
    if (devicesState[device].state === 'off') {
      triggerDeviceParent(device, 'on');
    }
  }

  return (
    <div className="chimenea">
      <div>
        <button className={`devices-button ${devicesState.chimenea.state === 'on' ? "devices-button--on" : "devices-button-off"}`} onClick={() => triggerDevice(devicesState.chimenea.id)}>{devicesState.chimenea.label}</button>
      </div>
    </div>
  );
}

export default ChimeneaSala;

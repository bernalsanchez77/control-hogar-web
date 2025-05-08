import React from 'react';
import './lamparaSala.css';

function LamparaSala({devicesState, triggerDeviceParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerDeviceParent(device, 'state', 'off');
    }
    if (devicesState[device].state === 'off') {
      triggerDeviceParent(device, 'state', 'on');
    }
  }

  return (
    <div className="lamparaSala">
      <div>
        <button className={`devices-button ${devicesState.lamparaSala.state === 'on' ? "devices-button--on" : "devices-button-off"}`} onClick={() => triggerDevice(devicesState.lamparaSala.id)}>{devicesState.lamparaSala.label}</button>
      </div>
    </div>
  );
}

export default LamparaSala;

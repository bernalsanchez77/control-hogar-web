import React from 'react';
import './hdmiSala.css';

function HdmiSala({devicesState, triggerDeviceParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'roku') {
      triggerDeviceParent(device, 'cable');
    }
    if (devicesState[device].state === 'cable') {
      triggerDeviceParent(device, 'roku');
    }
  }

  return (
    <div className="hdmiSala">
      <div>
        <button className={`devices-button ${devicesState.hdmiSala.state === 'on' ? "devices-button--on" : "devices-button-off"}`} onClick={() => triggerDevice(devicesState.hdmiSala.id)}>{devicesState.hdmiSala.label}</button>
      </div>
    </div>
  );
}

export default HdmiSala;

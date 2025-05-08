import React from 'react';
import './hdmiSala.css';

function HdmiSala({devicesState, triggerDeviceParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'roku') {
      triggerDeviceParent(device, 'cable', true);
    }
    if (devicesState[device].state === 'cable') {
      triggerDeviceParent(device, 'roku', true);
    }
  }

  return (
    <div className="hdmiSala">
      <div>
        <button className="no-select devices-button devices-button-off" onClick={() => triggerDevice(devicesState.hdmiSala.id)}>{devicesState.hdmiSala.label[devicesState.hdmiSala.state]}</button>
      </div>
    </div>
  );
}

export default HdmiSala;

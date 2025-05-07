import React from 'react';
import './hdmiSala.css';

function HdmiSala({devicesState, triggerDeviceParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerDeviceParent(device, 'off');
    }
    if (devicesState[device].state === 'off') {
      triggerDeviceParent(device, 'on');
    }
  }

  return (
    <div className="hdmiSala">
      {/* <div>
        <button className={`devices-button ${devicesState.hdmiSala.state === 'on' ? "devices-button--on" : "devices-button-off"}`} onClick={() => triggerDevice(devicesState.hdmiSala.id)}>{devicesState.hdmiSala.label}</button>
      </div> */}
    </div>
  );
}

export default HdmiSala;

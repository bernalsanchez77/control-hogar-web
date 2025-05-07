import React from 'react';
import './calentadorNegro.css';

function CalentadorNegro({devicesState, triggerDeviceParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerDeviceParent(device, 'off');
    }
    if (devicesState[device].state === 'off') {
      triggerDeviceParent(device, 'on');
    }
  }

  return (
    <div className="calentadorNegro">
      {/* <div>
        <button className={`devices-button ${devicesState.calentadorNegro.state === 'on' ? "devices-button--on" : "devices-button-off"}`} onClick={() => triggerDevice(devicesState.calentadorNegro.id)}>{devicesState.calentadorNegro.label}</button>
      </div> */}
    </div>
  );
}

export default CalentadorNegro;

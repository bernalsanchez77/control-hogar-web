import React from 'react';
import './calentadorBlanco.css';

function CalentadorBlanco({devicesState, triggerDeviceParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerDeviceParent([device], ['state'], ['off']);
    }
    if (devicesState[device].state === 'off') {
      triggerDeviceParent([device], ['state'], ['on']);
    }
  }

  return (
    <div className="calentadorBlanco">
      <div>
        <button className={`devices-button ${devicesState.calentadorBlanco.state === 'on' ? "devices-button--on" : "devices-button-off"}`} onClick={() => triggerDevice(devicesState.calentadorBlanco.id)}>{devicesState.calentadorBlanco.label}</button>
      </div>
    </div>
  );
}

export default CalentadorBlanco;

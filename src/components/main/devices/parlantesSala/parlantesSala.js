import React from 'react';
import './parlantesSala.css';

function ParlantesSala({devicesState, triggerDeviceParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerDeviceParent([device], ['state'], ['off']);
    }
    if (devicesState[device].state === 'off') {
      triggerDeviceParent([device], ['state'], ['on']);
    }
  }

  return (
    <div className="parlantesSala">
      <div>
        <button
          className={`devices-button ${devicesState.parlantesSala.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => triggerDevice(devicesState.parlantesSala.id)}>
          bafles
        </button>
      </div>
    </div>
  );
}

export default ParlantesSala;

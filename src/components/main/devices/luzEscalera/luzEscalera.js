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
        <button
          className={`devices-button ${devicesState.luzEscalera.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => triggerDevice(devicesState.luzEscalera.id)}>
          <img
            className='devices-button-img'
            src={devicesState.luzEscalera.img}
            alt="icono">
        </button>
      </div>
    </div>
  );
}

export default LuzEscalera;

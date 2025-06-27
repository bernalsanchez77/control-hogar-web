import React from 'react';
import './calentadorNegro.css';

function CalentadorNegro({devicesState, triggerDeviceParent}) {
  const triggerDevice = (device) => {
    if (devicesState[device].state === 'on') {
      triggerDeviceParent([device], ['state'], ['off']);
    }
    if (devicesState[device].state === 'off') {
      triggerDeviceParent([device], ['state'], ['on']);
    }
  }

  return (
    <div className="calentadorNegro">
      <div>
        <button
          className={`devices-button ${devicesState.calentadorNegro.state === 'on' ? "devices-button--on" : "devices-button-off"}`}
          onTouchStart={() => triggerDevice(devicesState.calentadorNegro.id)}>
          <img
            className='devices-button-img'
            src={devicesState.calentadornegro.img}
            alt="icono">
          </img>
          <div className='devices-led'></div>
        </button>
      </div>
    </div>
  );
}

export default CalentadorNegro;
